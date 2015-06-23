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
 * Search controller
 *
 */
class SearchController extends APIController {
    public function initialize() {
        parent::initialize();
        $this->Auth->allow('simpleSearch');
        
        $this->config = array(
            'endpoint' => array(
                'localhost' => array(
                    'host' => '127.0.0.1',
                    'port' => 8983,
                    'path' => '/solr/',
                )
            )
        );
    }

    public function simpleSearch() {
    	  $client = new Solarium\Client($this->config);
    	  $query = $client->createSelect();
    	  
    	  $facetSet = $query->getFacetSet();

        // create a facet field instance and set options
        //$facetSet->createFacetField('model')->setField('model'); // No sure how to use it yet

        // this executes the query and returns the result
        $resultset = $client->select($query);
    	  
        $object = new stdClass();
        $object->id = 321;
        $object->make = 'Mercedes';
        $object->model = 'XYZ';
        $object->type = 'Truck';
        $object->description = 'Via simple search';
        
        $object->test = $resultset;
        
        $this->setResponseValue('vehicles', array($object));
    }

    public function advancedSearch() {
        $object = new stdClass();
        $object->id = 123;
        $object->make = 'Volvo';
        $object->model = 'ABC';
        $object->type = 'Truck';
        $object->mileage = '23323223';
        $object->description = 'Via advanced search';
        $this->setResponseValue('vehicles', array($object));
    }
    
    private $config;
}
