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
use stdClass;

/**
 * Vehicle resource controller
 *
 */
class VehicleController extends APIController {
    public function initialize() {
        parent::initialize();
    }

    public function index() {
        $this->setResponseValue('vehicles', array()); // TODO: get all vehicles for the user
    }

    public function view($id) {
        //$this->setResponseValue('vehicle', array($id)); // TODO: get the vehicle if it belongs to the user account
        $object = new stdClass();
        $object->id = $id;
        $object->make = 'Volvo';
        $object->model = 'ABC';
        $object->type = 'Truck';
        $object->mileage = '23323223';
        $object->description = 'Advanced view, more data';
        $this->setResponseValue('vehicle', $object);
    }

    public function add() {
        // TODO: create
        $id = 123;

        return view($id);
    }

    public function edit($id) {
        // TODO: update the vehicle if it belongs to the user account
        return view($id);
    }

    public function delete($id) {
        // TODO: delete the vehicle if it belongs to the user account
        return view(array('status' => 'ok'));
    }

    public function preview($id) {
        //$this->setResponseValue('vehicle', array($id)); // TODO: get the vehicle if it belongs to the user account
        $object = new stdClass();
        $object->id = $id;
        $object->make = 'Mercedes';
        $object->model = 'XYZ';
        $object->type = 'Truck';
        $object->description = 'Simple view for not signed-in users';
        $this->setResponseValue('vehicle', $object);
    }

    protected function isActionAllowed($action, $userId, $paymentPlan) {
        if('preview' !== $action && $userId == null) {
            return false; // TODO: verify if the user can actually modify the vehicle
        }
        return parent::isActionAllowed($action, $userId, $paymentPlan);
    }
}
