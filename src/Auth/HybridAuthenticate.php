<?php
namespace App\Auth;

use Cake\Auth\BaseAuthenticate;
use Cake\Cache\Cache;
use Cake\Network\Request;
use Cake\Network\Response;
use Cake\Utility\Security;
use JWT;
use stdClass;

class HybridAuthenticate extends BaseAuthenticate {
    public function authenticate(Request $request, Response $response) {
        $user = $this->getUser($request);
        if($user == null) {
            // $user = authenticate using e-mail/password/token/mobile-token
        }
        $token = $this->generateToken($user);
        if($token) {
            $response->header('X-JWT-Token', $token);
            $response->header('X-Test', $user->id);
        }
    }

    public function getUser(Request $request) {
        $user = null;
        $authHeader = $request->header('Authorization');
        if(!empty($authHeader) && 'Bearer ' === substr($authHeader, 0, 7)) {
            $token = substr($authHeader, 7);
            try {
                $payload = JWT::decode($token, Security::salt(), array('HS512')); // TODO: get the key, not the salt.
                if($payload != null && $payload->user != null && $payload->jit != null) {
                    $key = $payload->user . '_' . $payload->jit;
                    $jit = Cache::read($key, $config = 'jit');
                    if($jit != null) {
                        //Cache::delete($key, $config = 'jit');
                        $user = $object = new stdClass();
                        $user->id = $payload->user;
                        $user->plan = $payload->plan;
//                        $this->setUserId($payload->user);
//                        $this->setPaymentPlan($payload->plan);
                    }
                }
            }
            catch(Exception $e) {
                //throw new UnauthorizedException('Invalid token'); // Ignore the exception (for now?), let the controller decide if the action is allowed for the unauthorized
            }
        }
        return $user;
    }

    private function generateToken($user) {
        if($user == null || $user->id == null) {
            return;
        }

        $isStrong = false;
        $jit = bin2hex(openssl_random_pseudo_bytes(16, $isStrong));
        Cache::write($user->id . '_' . $jit, $jit, $config = 'jit');

        $now = time();
        $payload = array(
            "iss" => "issuer, get the hostname or smth",
            //"issto" => $this->request->clientIp(),
            "iat" => $now,
            "nbf" => $now,
            "exp" => $now + 1800, // 30min, make configurable?
            "jit" => $jit,
            "user" => $user->id,
            "plan" => $user->plan
        );

        $token = JWT::encode($payload, Security::salt(), 'HS512'); // TODO: get the key, not the salt.
        return $token;
    }

}