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

use Cake\Core\Configure;
use Cake\Event\Event;

/**
 * Search controller
 *
 */
class AuthController extends APIController {
    public function initialize() {
        parent::initialize();
    }

    public function signin() {
        // if sign-in successful
        $this->generateToken(); // TODO: add some account information
        $this->setResponseValue('account', '{}'); // TODO: return the account from the database
    }

    public function signup() {
        // if sign-up successful
        $this->generateToken(); // TODO: add some account information
        $this->setResponseValue('account', '{}'); // TODO: return the account from the database
    }

    public function tokenRefresh() {
        if($this->getTokenPayload() != null) { // The token has been provided and is valid
            $this->generateToken();            // Create new token. TODO: use the payload data
            $this->setResponseValue('status', 'ok');
        }
        else {
            $this->response->statusCode(401);
            $this->setResponseValue('error', 'not_authorized');
        }
    }
}
