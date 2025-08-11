<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            // SQLite fallback: store as TEXT
            Schema::table('lmd_users', function (Blueprint $table) {
                $table->string('lmd_user_role')->default('customer')->change();
            });
        } else {
            // MySQL: modify ENUM
            DB::statement("ALTER TABLE lmd_users MODIFY COLUMN lmd_user_role ENUM('customer', 'vendor', 'deliveryboy', 'admin', 'organization')");
        }
    }

    public function down()
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            Schema::table('lmd_users', function (Blueprint $table) {
                $table->string('lmd_user_role')->default('customer')->change();
            });
        } else {
            DB::statement("ALTER TABLE lmd_users MODIFY COLUMN lmd_user_role ENUM('customer', 'vendor', 'deliveryboy', 'admin')");
        }
    }
};
