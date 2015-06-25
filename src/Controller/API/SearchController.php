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
use Solarium\Client;

/**
 * Search controller
 *
 */
class SearchController extends APIController {
    public function initialize() {
        parent::initialize();
        $this->Auth->allow('simpleSearch');

        $config = array(
            'endpoint' => array(
                'localhost' => array(
                    'host' => '127.0.0.1',
                    'port' => 8983,
                    'path' => '/solr/ideal_trucks',
                )
            )
        );
	$this->client = new Client($config);
    }

    public function simpleSearch() {
          $this->client->setAdapter('Solarium\Core\Client\Adapter\Http');

    	  $query = $this->client->createSelect();
          $query->setQuery('_text_:Mercedes');

    	  $facetSet = $query->getFacetSet();

        // create a facet field instance and set options
        $facetSet->createFacetField('make')->setField('make');
        $facetSet->createFacetField('model')->setField('model');
        $facetSet->createFacetField('type')->setField('type');                                                                                     

        // this executes the query and returns the result
        $resultset = $this->client->execute($query);

        $object = array();

	$data = $resultset->getData();
	$object['facets'] = $data['facet_counts'];
	$object['vehiclesFound'] = $data['response']['numFound'];
	$object['vehicles'] = array();
	foreach ($data['response']['docs'] as $document) {
		$vehicle = array();
		foreach ($document AS $field => $value) {
			$vehicle[$field] = is_array($value) ? implode(', ', $value) : $value;
		}
		array_push($object['vehicles'], $vehicle);
	}

        $this->setResponseValues($object);
    }

    public function advancedSearch() {
        $object = array();
        $object['id'] = 123;
        $object['make'] = 'Volvo';
        $object['model'] = 'ABC';
        $object['type'] = 'Truck';
        $object['mileage'] = '23323223';
        $object['description'] = 'Via advanced search';
        $this->setResponseValue('vehicles', array($object));
    }

    private $client;
}
