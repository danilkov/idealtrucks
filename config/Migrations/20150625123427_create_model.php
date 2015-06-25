<?php
use Phinx\Migration\AbstractMigration;

class CreateModel extends AbstractMigration
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
        $table = $this->table('models');
        $table->addColumn('name', 'text', [
            'default' => null,
            'null' => false,
        ]);
        $table->create();
        $this->execute('INSERT INTO models (name) VALUES ("N/A")');
    }
}
