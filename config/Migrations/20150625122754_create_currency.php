<?php
use Phinx\Migration\AbstractMigration;

class CreateCurrency extends AbstractMigration
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
        $table = $this->table('currencies');
        $table->addColumn('code', 'string', [
            'default' => null,
            'limit' => 10,
            'null' => false,
        ]);
        $table->addColumn('name', 'string', [
            'default' => null,
            'limit' => 255,
            'null' => false,
        ]);
        $table->addColumn('description', 'text', [
            'default' => null,
            'null' => false,
        ]);

        $table->create();
	$this->execute('INSERT INTO currencies (code, name, description) VALUES ("EUR", "Euro", "Euro")');
        $this->execute('INSERT INTO currencies (code, name, description) VALUES ("USD", "USD", "US Dollar")');
        $this->execute('INSERT INTO currencies (code, name, description) VALUES ("RUR", "Ruble", "Russian Ruble")');
    }
}
