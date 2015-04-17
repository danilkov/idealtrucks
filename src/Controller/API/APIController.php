<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link      http://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */
namespace App\Controller;

use App\Model\Behavior\Error;
use Cake\Event\Event;
use Cake\Network\Exception\UnauthorizedException;
use Cake\Utility\Security;
use JWT;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link http://book.cakephp.org/3.0/en/controllers.html#the-app-controller
 */
class APIController extends AppController {
    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * @return void
     */
    public function initialize() {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->RequestHandler->renderAs($this, 'json');
    }

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);

        $this->$request->params['action'];

        $authHeader = $this->request->header('Authorization');
        if(!empty($authHeader) && 'Bearer ' === substr($authHeader, 0, 7)) {
            $token = substr($authHeader, 7);
            try {
                $payload = JWT::decode($token, Security::salt(), array('HS512')); // TODO: get the key, not the salt.
                // TODO: verify $payload's jit
                $this->payload = $payload;
            }
            catch(Exception $e) {
//                $this->payload = null;
                throw new UnauthorizedException('Invalid token');
            }
        }
    }

    public function afterFilter(Event $event) {
        parent::afterFilter($event);

        if($this->payload != null) {
            $this->generateToken($this->payload->user);
        }
    }

    public function notImplemented() {
        $this->response->statusCode(501);
        $this->setResponseValue('error', new Error('Not Implemented'));
    }

    protected function setResponseValue($name, $value) {
        $this->set($name, $value);
        $this->set('_serialize', array($name));
    }

    protected final function generateToken($userId) {
        $now = time();
        $isStrong = false;
        $payload = array(
            "iss" => "issuer, get the hostname or smth",
            "iat" => $now,
            "nbf" => $now,
            "exp" => $now + 1800, // 30min, make configurable?
            "jit" => 1, // TODO: use the jit only once, reissue the token with the new jit
            "user" => $userId,
            "test" => bin2hex(openssl_random_pseudo_bytes(32, $isStrong)),
            "test-strong" => $isStrong,
            "tier" => "free"
        );

        $token = JWT::encode($payload, Security::salt(), 'HS512'); // TODO: get the key, not the salt.
        $this->response->header('X-JWT-Token', $token);
        return $token;
    }

    protected final function getTokenPayload() {
        return $this->payload;
    }

    private $payload;
}
