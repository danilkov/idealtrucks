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
use Cake\Cache\Cache;
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
        $this->loadComponent('Auth', [
            'authenticate' => ['Hybrid'],
            'loginAction' => '/signin'
        ]);
        //$this->Auth->allow(); // TODO: defer the call to the derived class
        $this->loadComponent('RequestHandler');
        $this->RequestHandler->renderAs($this, 'json');
    }

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);

        $user = $this->Auth->identify();
        if($user != null) {
            $this->Auth->setUser($user);
        }
        else {
            $this->response->header('X-Debug', 'No user returned');
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
}
