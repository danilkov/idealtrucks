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

/**
 * Vehicle resource controller
 *
 */
class VehicleController extends APIController {
    public function initialize() {
        parent::initialize();
    }

    public function simpleSearch() {
        $this->setResponseValue('vehicles',
            array('vehicle' => array('make' => 'Mercedes', 'model' => 'XYZ', 'type' => 'Truck', 'description' => 'Test')));
    }

    public function advancedSearch() {
        $this->setResponseValue('vehicles',
            array('vehicle' => array('make' => 'Volvo', 'model' => 'ABC', 'type' => 'Truck', 'mileage' => '23323223', 'description' => 'Via advanced search')));
    }

    protected function isActionAllowed($action, $userId, $paymentPlan) {
        if('preview' !== $action && $userId == null) {
            return false; // TODO: verify if the user can actually modify the vehicle
        }
        return parent::isActionAllowed($action, $userId, $paymentPlan);
    }
}
