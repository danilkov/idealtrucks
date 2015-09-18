<?php
use Phinx\Migration\AbstractMigration;

class CreateMake extends AbstractMigration
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
        $table = $this->table('makes');
        $table->addColumn('name', 'text', [
            'default' => null,
            'null' => false,
        ]);
        $table->create();

        $this->execute('INSERT INTO makes (name) VALUES ("Mercedes")');
        $this->execute('INSERT INTO makes (name) VALUES ("Volvo")');
        $this->execute('INSERT INTO makes (name) VALUES ("Scania")');
        $this->execute('INSERT INTO makes (name) VALUES ("MAN")');
    }
}
