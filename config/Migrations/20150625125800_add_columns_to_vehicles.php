<?php
use Phinx\Migration\AbstractMigration;

class AddColumnsToVehicles extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-change-method
     * @return void
     */
    public function change()
    {
        $table = $this->table('vehicles');
        $table->addColumn('make', 'integer', [
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);
        $table->addColumn('model', 'integer', [
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);
        $table->addColumn('type', 'integer', [
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);
        $table->update();

        $this->execute('UPDATE vehicles SET make = 3, model = 1, type = 1 where id = 1');
        $this->execute('UPDATE vehicles SET make = 1, model = 1, type = 1 where id = 2');

	$table->addForeignKey('currency', 'currencies', 'id');
        $table->addForeignKey('make', 'makes', 'id');
        $table->addForeignKey('model', 'models', 'id');
        $table->addForeignKey('type', 'types', 'id');
    }
}
