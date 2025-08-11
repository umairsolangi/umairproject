<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Vendor;
use App\Models\Shop;
use App\Models\City;
use App\Models\ShopCategory;
use App\Models\Vehicle;
use App\Models\CourierItemCategory;
use App\Models\CourierItem;
use App\Models\Apivendor;
use App\Models\Apimethod;
use App\Models\Variable;
use App\Models\Mapping;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller {

    public function login( Request $request ) {
        // Validate input
        $validated = $request->validate( [
            'email' => 'required|email',
            'password' => 'required|string|min:1',
        ] );

        // Fetch the user based on the email
        $user = DB::table( 'lmd_users' )
        ->where( 'email', $validated[ 'email' ] )
        ->first();
        Log::info( 'Fetched user:', [ 'user_id' => $user->id ?? 'Not Found', 'email' => $user->email ?? 'Not Found' ] );

        // Check if user exists and verify the password
        if ( $user && $validated[ 'password' ] === $user->password ) {

            Log::info( 'Login successful for user:', [ 'user_id' => $user->id ] );
            Log::info( 'Login successful for user:', [ 'pass' => $user->password ] );
            Log::info( 'Login successful for user:', [ '$validated' => $validated[ 'password' ] ] );
            // Return response with user details and role
            return response()->json( [
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->lmd_user_role,
                ],
            ], 200 );
        }

        Log::info( 'Login successful for user:', [ 'user_id' => $user->id ] );
        Log::info( 'Login successful for user:', [ 'pass' => $user->password ] );
        Log::info( 'Login successful for user:', [ '$validated' => $validated[ 'password' ] ] );

        // If credentials are invalid
        return response()->json( [
            'message' => 'Invalid credentials',
        ], 401 );
    }

    public function getAllCustomers() {
        $customers = DB::table( 'lmd_users' )->where( 'lmd_user_role', 'customer' )->get();
        return response()->json( $customers, 200 );
    }

    public function getAllDeliveryBoys() {
        $deliveryboys = DB::table( 'lmd_users' )->where( 'lmd_user_role', 'deliveryboy' )->get();
        return response()->json( $deliveryboys, 200 );
    }

    // public function getAllVendors() {
    //     $vendors = Vendor::all();

    //     if ( $vendors->isEmpty() ) {
    //         return response()->json( [ 'message' => 'No vendors found.' ], 404 );
    //     }

    //     return response()->json( $vendors, 200 );
    // }

    public function getAllVendors() {
        $baseUrl = url( '/' );
        // Get the base URL ( e.g., http://192.168.43.63:8000 )

        $vendors = DB::table( 'vendors' )
        ->join( 'lmd_users', 'vendors.lmd_users_ID', '=', 'lmd_users.id' )
        ->select(
            'lmd_users.id as lmd_user_id',
            'lmd_users.name',
            'lmd_users.email',
            'lmd_users.phone_no',
            'lmd_users.cnic',
            DB::raw( "CASE 
                            WHEN lmd_users.profile_picture IS NULL OR lmd_users.profile_picture = '' 
                            THEN NULL 
                            ELSE CONCAT('$baseUrl/storage/', lmd_users.profile_picture) 
                        END as profile_picture" ),
            'vendors.id as vendor_id',
            'vendors.vendor_type',
            'vendors.approval_status'
        )
        ->distinct()
        ->get();

        if ( $vendors->isEmpty() ) {
            return response()->json( [ 'message' => 'No vendors found.' ], 404 );
        }

        return response()->json( $vendors, 200 );
    }

    public function getAllOrders() {
        $orders = Order::all();

        if ( $orders->isEmpty() ) {
            return response()->json( [ 'message' => 'No orders found.' ], 404 );
        }

        return response()->json( $orders, 200 );
    }

    // // Reject Delivery Boy

    // public function rejectDeliveryBoy( Request $request, $id ) {
    //     // Validate the incoming request
    //     $validated = $request->validate( [
    //         'rejection_reasons' => 'nullable|array',
    //         'rejection_reasons.*' => 'string|max:255',
    // ] );

    //     // Start DB transaction
    //     DB::beginTransaction();

    //     try {
    //         // Fetch delivery boy record
    //         $deliveryBoy = DB::table( 'deliveryboys' )->where( 'id', $id )->first();

    //         if ( !$deliveryBoy ) {
    //             return response()->json( [ 'message' => 'Delivery Boy not found.' ], 404 );
    //         }

    //         // Handle rejection
    //         if ( !empty( $validated[ 'rejection_reasons' ] ) ) {
    //             foreach ( $validated[ 'rejection_reasons' ] as $reason ) {
    //                 // Insert rejection reasons with 'pending' status
    //                 DB::table( 'rejectionreasons' )->insert( [
    //                     'reason' => $reason,
    //                     'lmd_users_ID' => $deliveryBoy->lmd_users_ID,
    //                     'status' => 'pending',  // Set status to pending
    //                     'created_at' => now(),
    //                     'updated_at' => now(),
    // ] );
    //             }

    //             // Update the approval status to 'rejected'
    //             DB::table( 'deliveryboys' )->where( 'id', $id )->update( [
    //                 'approval_status' => 'rejected',
    //                 'updated_at' => now(),
    // ] );

    //             // Commit the transaction
    //             DB::commit();

    //             return response()->json( [
    //                 'message' => 'Delivery Boy rejected successfully!',
    // ], 200 );
    //         }

    //         return response()->json( [
    //             'message' => 'At least one rejection reason is required.',
    // ], 400 );

    //     } catch ( \Exception $e ) {
    //         DB::rollBack();
    //         return response()->json( [ 'message' => 'Failed to reject delivery boy.' ], 500 );
    //     }
    // }
    // Reject Delivery Boy

    public function rejectDeliveryBoy( Request $request, $id ) {
        // Validate the incoming request
        $validated = $request->validate( [
            'rejection_reasons' => 'required|array', // Ensure rejection reasons are provided
            'rejection_reasons.*' => 'string|max:255', // Each reason must be a string
        ] );

        // Start DB transaction
        DB::beginTransaction();

        try {
            // Fetch delivery boy record
            $deliveryBoy = DB::table( 'deliveryboys' )->where( 'ID', $id )->first();
            // Use 'ID' as per your table structure

            if ( !$deliveryBoy ) {
                return response()->json( [ 'message' => 'Delivery Boy not found.' ], 404 );
            }

            // Insert rejection reasons into DeliveryBoyRejectionReasons table
            foreach ( $validated[ 'rejection_reasons' ] as $reason ) {
                DB::table( 'deliveryboysrejectionreasons' )->insert( [
                    'reason' => $reason,
                    'deliveryboys_ID' => $deliveryBoy->id, // Use 'ID' as per the deliveryboys table structure
                    'status' => 'Pending', // Set status to 'Pending'
                    'created_at' => now(),
                    'updated_at' => now(),
                ] );
            }

            // Update the approval status of the delivery boy to 'rejected'
            DB::table( 'deliveryboys' )->where( 'id', $id )->update( [ // Use 'ID' here as well
            'approval_status' => 'rejected'

        ] );

        // Commit the transaction
        DB::commit();

        return response()->json( [
            'message' => 'Delivery Boy rejected successfully!',
        ], 200 );

    } catch ( \Exception $e ) {
        // Rollback the transaction in case of an error
        DB::rollBack();
        return response()->json( [
            'message' => 'Failed to reject delivery boy.',
            'error' => $e->getMessage(),
        ], 500 );
    }
}

// Accept Delivery Boy

public function acceptDeliveryBoy( Request $request, $id ) {
    // Validate the incoming request
    $validated = $request->validate( [
        'approval_status' => 'required|in:approved',
    ] );

    // Start DB transaction
    DB::beginTransaction();

    try {
        // Fetch delivery boy record
        $deliveryBoy = DB::table( 'deliveryboys' )->where( 'id', $id )->first();

        if ( !$deliveryBoy ) {
            return response()->json( [ 'message' => 'Delivery Boy not found.' ], 404 );
        }

        // Check if there are any rejection reasons with 'pending' status
        $pendingRejections = DB::table( 'deliveryboysrejectionreasons' )
        ->where( 'deliveryboys_ID', $deliveryBoy->id )
        ->where( 'status', 'pending' )
        ->exists();

        if ( $pendingRejections ) {
            return response()->json( [
                'message' => 'Cannot approve delivery boy with pending rejection reasons.',
            ], 400 );
        }

        // If no pending rejections, proceed with approval
        DB::table( 'deliveryboys' )->where( 'id', $id )->update( [
            'approval_status' => 'approved'

        ] );

        // Commit the transaction
        DB::commit();

        return response()->json( [
            'message' => 'Delivery Boy approved successfully!',
        ], 200 );

    } catch ( \Exception $e ) {
        DB::rollBack();
        return response()->json( [ 'message' => 'Failed to approve delivery boy.' ], 500 );
    }
}

public function correctRejectionReason( Request $request, $id ) {
    // Validate the incoming request
    $validated = $request->validate( [
        'rejection_reason_id' => 'required|exists:deliveryboysrejectionreasons,id',
    ] );

    // Start DB transaction
    DB::beginTransaction();

    try {
        // Fetch the delivery boy by ID
        $deliveryBoy = DB::table( 'deliveryboys' )
        ->where( 'id', $id ) // Use the $id parameter here
        ->first();

        // Check if the delivery boy exists and is linked to a valid lmd_users_ID
        if ( !$deliveryBoy ) {
            return response()->json( [ 'message' => 'Delivery Boy not found.' ], 404 );
        }

        // Fetch the rejection reason by ID
        $rejectionReason = DB::table( 'deliveryboysrejectionreasons' )
        ->where( 'id', $validated[ 'rejection_reason_id' ] )
        ->where( 'deliveryboys_ID', $deliveryBoy->id )
        ->where( 'status', 'pending' ) // Only allow correction for pending reasons
        ->first();

        // Check if the rejection reason exists and is pending
        if ( !$rejectionReason ) {
            return response()->json( [ 'message' => 'Rejection reason not found or already corrected.' ], 404 );
        }

        // Update the rejection reason status to 'corrected'
        DB::table( 'deliveryboysrejectionreasons' )
        ->where( 'id', $validated[ 'rejection_reason_id' ] )
        ->update( [
            'status' => 'corrected',
            'updated_at' => now(),
        ] );

        // Commit the transaction
        DB::commit();

        // Return success response
        return response()->json( [
            'message' => 'Rejection reason corrected successfully!',
        ], 200 );
    } catch ( \Exception $e ) {
        // Rollback the transaction on error
        DB::rollBack();

        // Log the error
        Log::error( "Failed to correct rejection reason for delivery boy ID: {$id}. Error: " . $e->getMessage() );

        // Return error response
        return response()->json( [ 'message' => 'Failed to correct rejection reason.' ], 500 );
    }
}

public function getRejectionReasonsForDeliveryBoy( $deliveryBoyId ) {
    // Fetch the delivery boy and their associated lmd_users_ID
    $deliveryBoy = DB::table( 'deliveryboys' )
    ->where( 'id', $deliveryBoyId )
    ->first();

    // Check if the delivery boy exists
    if ( !$deliveryBoy ) {
        return response()->json( [ 'message' => 'Delivery Boy not found.' ], 404 );
    }

    // Fetch all rejection reasons for the lmd_users_ID linked to the delivery boy
    $rejectionReasons = DB::table( 'deliveryboysrejectionreasons' )
    ->where( 'deliveryboys_ID', $deliveryBoy->id )
    ->get();

    // Check if rejection reasons exist for this delivery boy
    if ( $rejectionReasons->isEmpty() ) {
        return response()->json( [ 'message' => 'No rejection reasons found for this delivery boy.' ], 404 );
    }

    // Return the rejection reasons
    return response()->json( [
        'delivery_boy_id' => $deliveryBoyId,
        'rejection_reasons' => $rejectionReasons,
    ], 200 );
}

///////////////////////////////Vendor Rejection///////////////////////
//////////////////////////////////////////////////////////////////////
// Reject Vendor

public function rejectVendor( Request $request, $id ) {
    // Validate request
    $validated = $request->validate( [
        'rejection_reasons' => 'required|array',
        'rejection_reasons.*' => 'string|max:255',
    ] );

    DB::beginTransaction();

    try {
        // Fetch vendor record
        $vendor = DB::table( 'vendors' )->where( 'id', $id )->first();

        if ( !$vendor ) {
            return response()->json( [ 'message' => 'Vendor not found.' ], 404 );
        }

        // Insert rejection reasons into VendorRejectionReasons table
        foreach ( $validated[ 'rejection_reasons' ] as $reason ) {
            DB::table( 'vendorrejectionreasons' )->insert( [
                'reason' => $reason,
                'vendors_ID' => $vendor->id,
                'status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ] );
        }

        // Update vendor approval status to 'rejected'
        DB::table( 'vendors' )->where( 'id', $id )->update( [
            'approval_status' => 'rejected'
        ] );

        DB::commit();

        return response()->json( [ 'message' => 'Vendor rejected successfully!' ], 200 );

    } catch ( \Exception $e ) {
        DB::rollBack();
        return response()->json( [ 'message' => 'Failed to reject vendor.', 'error' => $e->getMessage() ], 500 );
    }
}

// // Accept Vendor
// public function acceptVendor( Request $request, $id ) {
//     $validated = $request->validate( [
//         'approval_status' => 'required|in:approved',
// ] );

//     DB::beginTransaction();

//     try {
//         $vendor = DB::table( 'vendors' )->where( 'id', $id )->first();

//         if ( !$vendor ) {
//             return response()->json( [ 'message' => 'Vendor not found.' ], 404 );
//         }

//         // Check for pending rejection reasons
//         $pendingRejections = DB::table( 'vendorrejectionreasons' )
//             ->where( 'vendors_ID', $vendor->id )
//             ->where( 'status', 'pending' )
//             ->exists();

//         if ( $pendingRejections ) {
//             return response()->json( [ 'message' => 'Cannot approve vendor with pending rejection reasons.' ], 400 );
//         }

//         // Approve the vendor
//         DB::table( 'vendors' )->where( 'id', $id )->update( [
//             'approval_status' => 'approved'
// ] );

//         DB::commit();

//         return response()->json( [ 'message' => 'Vendor approved successfully!' ], 200 );

//     } catch ( \Exception $e ) {
//         DB::rollBack();
//         return response()->json( [ 'message' => 'Failed to approve vendor.' ], 500 );
//     }
// }
// Accept Vendor

public function acceptVendor( $id ) {
    DB::beginTransaction();

    try {
        $vendor = DB::table( 'vendors' )->where( 'id', $id )->first();

        if ( !$vendor ) {
            return response()->json( [ 'message' => 'Vendor not found.' ], 404 );
        }

        // Check for pending rejection reasons
        $pendingRejections = DB::table( 'vendorrejectionreasons' )
        ->where( 'vendors_ID', $vendor->id )
        ->where( 'status', 'pending' )
        ->exists();

        if ( $pendingRejections ) {
            return response()->json( [ 'message' => 'Cannot approve vendor with pending rejection reasons.' ], 400 );
        }

        // Approve the vendor
        DB::table( 'vendors' )->where( 'id', $id )->update( [
            'approval_status' => 'approved'
        ] );

        DB::commit();

        return response()->json( [ 'message' => 'Vendor approved successfully!' ], 200 );

    } catch ( Exception $e ) {
        DB::rollBack();
        return response()->json( [ 'message' => 'Failed to approve vendor.' ], 500 );
    }
}

// Correct Rejection Reason for Vendor

public function correctVendorRejectionReason( Request $request, $id ) {
    $validated = $request->validate( [
        'rejection_reason_id' => 'required|exists:vendorrejectionreasons,id',
    ] );

    DB::beginTransaction();

    try {
        $vendor = DB::table( 'vendors' )->where( 'id', $id )->first();

        if ( !$vendor ) {
            return response()->json( [ 'message' => 'Vendor not found.' ], 404 );
        }

        $rejectionReason = DB::table( 'vendorrejectionreasons' )
        ->where( 'id', $validated[ 'rejection_reason_id' ] )
        ->where( 'vendors_ID', $vendor->id )
        ->where( 'status', 'pending' )
        ->first();

        if ( !$rejectionReason ) {
            return response()->json( [ 'message' => 'Rejection reason not found or already corrected.' ], 404 );
        }

        DB::table( 'vendorrejectionreasons' )
        ->where( 'id', $validated[ 'rejection_reason_id' ] )
        ->update( [
            'status' => 'corrected',
            'updated_at' => now(),
        ] );

        DB::commit();

        return response()->json( [ 'message' => 'Rejection reason corrected successfully!' ], 200 );

    } catch ( \Exception $e ) {
        DB::rollBack();
        return response()->json( [ 'message' => 'Failed to correct rejection reason.' ], 500 );
    }
}

// Get Vendor Rejection Reasons

public function getRejectionReasonsForVendor( $vendorId ) {
    $vendor = DB::table( 'vendors' )->where( 'id', $vendorId )->first();

    if ( !$vendor ) {
        return response()->json( [ 'message' => 'Vendor not found.' ], 404 );
    }

    $rejectionReasons = DB::table( 'vendorrejectionreasons' )
    ->where( 'vendors_ID', $vendor->id )
    ->select( 'id', 'reason', 'status' ) // Only fetching required columns
    ->get();

    if ( $rejectionReasons->isEmpty() ) {
        return response()->json( [ 'message' => 'No rejection reasons found.' ], 404 );
    }

    return response()->json( $rejectionReasons, 200 );
}

// // Get Vendor Rejection Reasons
// public function getRejectionReasonsForVendor( $vendorId ) {
//     $vendor = DB::table( 'vendors' )->where( 'id', $vendorId )->first();

//     if ( !$vendor ) {
//         return response()->json( [ 'message' => 'Vendor not found.' ], 404 );
//     }

//     $rejectionReasons = DB::table( 'vendorrejectionreasons' )
//         ->where( 'vendors_ID', $vendor->id )
//         ->get();

//     if ( $rejectionReasons->isEmpty() ) {
//         return response()->json( [ 'message' => 'No rejection reasons found for this vendor.' ], 404 );
//     }

//     return response()->json( [
//         'vendor_id' => $vendorId,
//         'rejection_reasons' => $rejectionReasons,
// ], 200 );
// }

///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

public function getAllVehicles() {

    $vehicles = Vehicle::all();

    if ( $vehicles->isEmpty() ) {
        return response()->json( [ 'message' => 'No vehicles found.' ], 404 );
    }

    return response()->json( $vehicles, 200 );
}

// Add a new category to the shopcategory table

public function addShopCategory( Request $request ) {
    $validatedData = $request->validate( [
        'name' => 'required|string|max:255|unique:shopcategory,name',
    ] );

    $category = ShopCategory::create( $validatedData );

    return response()->json( [ 'message' => 'Category added successfully', 'category' => $category ], 201 );
}

public function getAllCities() {
    $cities = DB::table( 'city' )->select( 'id', 'name' )->get();
    return response()->json( $cities, 200 );
}

public function addCity( Request $request ) {
    // Validate the request
    $validated = $request->validate( [
        'name' => 'required|string|max:100|unique:city,name',
    ] );

    try {
        // Insert city
        DB::table( 'city' )->insert( [
            'name' => $validated[ 'name' ],
        ] );

        return response()->json( [ 'message' => 'City added successfully!' ], 201 );

    } catch ( Exception $e ) {
        return response()->json( [ 'message' => 'Failed to add city.', 'error' => $e->getMessage() ], 500 );
    }
}

public function deleteCity( $id ) {
    try {
        // Check if city exists
        $city = DB::table( 'city' )->where( 'id', $id )->first();

        if ( !$city ) {
            return response()->json( [ 'message' => 'City not found.' ], 404 );
        }

        // Delete city
        DB::table( 'city' )->where( 'id', $id )->delete();

        return response()->json( [ 'message' => 'City deleted successfully!' ], 200 );

    } catch ( Exception $e ) {
        return response()->json( [ 'message' => 'Failed to delete city.', 'error' => $e->getMessage() ], 500 );
    }
}

// public function approveBranch( $branchId ) {
//     $branch = DB::table( 'branches' )->where( 'id', $branchId )->first();

//     if ( !$branch || $branch->approval_status !== 'pending' ) {
//         return response()->json( [ 'message' => 'Branch not found or already processed.' ], 404 );
//     }

//     DB::table( 'branches' )->where( 'id', $branchId )->update( [
//         'approval_status' => 'approved'

// ] );

//     return response()->json( [ 'message' => 'Branch approved successfully!' ], 200 );
// }

public function approveBranch( $branchId ) {
    // Start DB transaction
    DB::beginTransaction();

    try {
        // Fetch branch record
        $branch = DB::table( 'branches' )->where( 'id', $branchId )->first();

        // Check if the branch exists and is not already approved
        if ( !$branch || $branch->approval_status === 'approved' ) {
            return response()->json( [ 'message' => 'Branch not found or already approved.' ], 404 );
        }

        // Check if there are any pending rejection reasons for the branch
        $pendingRejections = DB::table( 'branchesrejectionreasons' )
        ->where( 'branches_ID', $branch->id )
        ->where( 'status', 'Pending' )
        ->exists();

        if ( $pendingRejections ) {
            return response()->json( [
                'message' => 'Cannot approve branch with pending rejection reasons.',
            ], 400 );
        }

        // Update branch approval status to 'approved'
        DB::table( 'branches' )->where( 'id', $branchId )->update( [
            'approval_status' => 'approved',
        ] );

        // Commit the transaction
        DB::commit();

        return response()->json( [ 'message' => 'Branch approved successfully!' ], 200 );

    } catch ( Exception $e ) {
        // Rollback the transaction on error
        DB::rollBack();

        // Log the error
        Log::error( "Failed to approve branch ID: {$branchId}. Error: " . $e->getMessage() );

        return response()->json( [ 'message' => 'Failed to approve branch.' ], 500 );
    }
}

//Not working yet

public function rejectBranch( Request $request, $branchId ) {
    $validated = $request->validate( [
        'rejection_reasons' => 'required|array',
        'rejection_reasons.*' => 'string|max:255',
    ] );

    $branch = DB::table( 'branches' )->where( 'id', $branchId )->first();

    if ( !$branch || $branch->approval_status !== 'pending' ) {
        return response()->json( [ 'message' => 'Branch not found or already processed.' ], 404 );
    }

    DB::beginTransaction();

    try {
        foreach ( $validated[ 'rejection_reasons' ] as $reason ) {
            DB::table( 'branchesrejectionreasons' )->insert( [
                'reason' => $reason,
                'branches_ID' => $branch->id, // Assuming vendor's ID is linked via shop
                    'status' => 'pending',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
    
            DB::table('branches')->where('id', $branchId)->update([
                'approval_status' => 'rejected'
             
            ]);
    
            DB::commit();
            return response()->json(['message' => 'Branch rejected successfully!'], 200);
    
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to reject branch.', 'error' => $e->getMessage()], 500);
        }
    }

    
public function getPendingBranches() {
    $baseUrl = url('/'); // Base URL for images

    $branches = DB::table('branches')
        ->join('shops', 'branches.shops_id', '=', 'shops.id')
        ->join('shopcategory', 'shops.shopcategory_ID', '=', 'shopcategory.id')
        ->join('vendors', 'shops.vendors_ID', '=', 'vendors.id')
        ->join('lmd_users', 'vendors.lmd_users_ID', '=', 'lmd_users.id')
        ->join('area', 'branches.area_id', '=', 'area.id')
        ->join('city', 'area.city_id', '=', 'city.id')
        //->where('branches.approval_status', 'pending')
        ->select(
            'branches.id as branch_id',
            'branches.description as branch_description',
            DB::raw("CONCAT('$baseUrl/storage/',branches.branch_picture) as branch_picture"),
            'branches.approval_status as branch_approval_status',
            'shops.id as shop_id',
            'shops.name as shop_name',
            'shopcategory.id as shop_category_id',
            'shopcategory.name as shop_category',
            'vendors.id as vendor_id',
            'vendors.vendor_type as vendor_type',
            'vendors.approval_status as vendor_approval_status',
            'lmd_users.id as lmd_user_id',
            'lmd_users.name as vendor_name',
            'lmd_users.email as vendor_email',
            DB::raw("CONCAT('$baseUrl/storage', lmd_users.profile_picture) as vendor_profile_picture"),
            'area.name as area',
            'city.name as city'
        )
        ->get();

    return response()->json(['pending_branches' => $branches], 200);
}

// Get Branch Rejection Reasons
public function getRejectionReasons($branchId) {
    $branch = DB::table('branches')->where('id', $branchId)->first();

    if (!$branch) {
        return response()->json(['message' => 'Branch not found.'], 404);
    }

    $rejectionReasons = DB::table('branchesrejectionreasons')
        ->where('branches_ID', $branch->id)
        ->select('id', 'reason', 'status') // Only fetching required columns
        ->get();

    if ($rejectionReasons->isEmpty()) {
        return response()->json(['message' => 'No rejection reasons found.'], 404);
    }

    return response()->json($rejectionReasons, 200);
}

public function correctBranchRejectionReason(Request $request, $branch_id) {
    // Validate the incoming request
    $validated = $request->validate([
        'rejection_reason_id' => 'required|exists:branchesrejectionreasons, id',
    ]);

    // Start DB transaction
    DB::beginTransaction();

    try {
        // Fetch the branch by ID
        $branch = DB::table('branches')
            ->where('id', $branch_id) // Use the $branch_id parameter here
            ->first();

        // Check if the branch exists
        if (!$branch) {
            return response()->json(['message' => 'Branch not found.'], 404);
        }

        // Fetch the rejection reason by ID and branch ID
        $rejectionReason = DB::table('branchesrejectionreasons')
            ->where('id', $validated['rejection_reason_id'])
            ->where('branches_ID', $branch->id)
            ->where('status', 'Pending') // Only allow correction for pending reasons
            ->first();

        // Check if the rejection reason exists and is pending
        if (!$rejectionReason) {
            return response()->json(['message' => 'Rejection reason not found or already corrected.'], 404);
        }

        // Update the rejection reason status to 'Corrected'
        DB::table('branchesrejectionreasons')
            ->where('id', $validated['rejection_reason_id'])
            ->update([
                'status' => 'Corrected',
                'updated_at' => now(),
            ]);

        // Commit the transaction
        DB::commit();

        // Return success response
        return response()->json([
            'message' => 'Rejection reason corrected successfully!',
        ], 200);
    } catch (\Exception $e) {
        // Rollback the transaction on error
        DB::rollBack();

        // Log the error
        Log::error("Failed to correct rejection reason for branch ID: {$branch_id}. Error: " . $e->getMessage());

        // Return error response
        return response()->json(['message' => 'Failed to correct rejection reason.'], 500);
    }
}



    
    public function getAllShops() {
        try {
            // Fetch all shops with their related vendor and user details
            $shops = DB::table('shops')
                ->join('vendors', 'shops.vendors_id', ' = ', 'vendors.id')  // Corrected join condition
                ->join('lmd_users', 'vendors.lmd_users_id', ' = ', 'lmd_users.id')  // Corrected join condition
                ->select(
                    'shops.id AS shop_id',
                    'shops.name AS shop_name',
                    'shops.description',
                    'shops.status',
                    'shops.shopcategory_id',
                    'vendors.id AS vendor_id',
                    'lmd_users.name AS vendor_name',
                    'lmd_users.email AS vendor_email'
                )
                ->get();
    
            return response()->json([
                'message' => 'Shops retrieved successfully!',
                'data' => $shops
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve shops.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getAllBranches() {
        try {
            // Fetch all branches with their related shop, vendor, and user details
            $branches = DB::table('branches')
                ->join('shops', 'branches.shops_id', ' = ', 'shops.id')
                ->join('vendors', 'shops.vendors_id', ' = ', 'vendors.id')
                ->join('lmd_users', 'vendors.lmd_users_id', ' = ', 'lmd_users.id')
                ->select(
                    'branches.id AS branch_id',
                    'branches.latitude',
                    'branches.longitude',
                    'branches.description AS branch_description',
                    'branches.opening_hours',
                    'branches.closing_hours',
                    'branches.contact_number',
                    'branches.status AS branch_status',
                    'branches.approval_status',
                    'shops.id AS shop_id',
                    'shops.name AS shop_name',
                    'vendors.id AS vendor_id',
                    'lmd_users.name AS vendor_name',
                    'lmd_users.email AS vendor_email'
                )
                ->get();
    
            return response()->json([
                'message' => 'Branches retrieved successfully!',
                'data' => $branches
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve branches.',
                'error' => $e->getMessage()
                ], 500 );
            }
        }


//////////////////////////////////API Vendors///////////////////////
public function getApiVendorsWithUsers()
{

    $baseUrl = url('/'); // Get the base URL (e.g., http://192.168.43.63:8000)
    

    $vendors = DB::table('vendors')
        ->join('lmd_users', 'vendors.lmd_users_ID', '=', 'lmd_users.id')
        ->where('vendors.vendor_type', 'API Vendor')
        ->select('vendors.id as vendor_ID','vendors.vendor_type',
        'vendors.approval_status','lmd_users_ID',
         'lmd_users.name', 'lmd_users.email',
          'lmd_users.phone_no', 'lmd_users.cnic',
          DB::raw("CASE 
          WHEN lmd_users.profile_picture IS NULL OR lmd_users.profile_picture = '' 
          THEN NULL 
          ELSE CONCAT('$baseUrl/storage/', lmd_users.profile_picture) 
      END as profile_picture"),
          'lmd_users.account_creation_date')
        ->get();   //vendors.*  for al data

    return response()->json($vendors);
}




public function getIntegrationDetails($branchId)
{
    // Step 1: Fetch apivendor based on branch_ID
    $apiVendor = Apivendor::where('branches_ID', $branchId)
        ->select('id', 'api_key', 'api_base_url', 'api_auth_method', 'api_version', 'vendor_integration_status', 'response_format', 'branches_ID')
        ->first();

    if (!$apiVendor) {
        return response()->json([
            'status' => false,
            'message' => "No API integration found for this branch.",
            'data' => []
        ], 404);
    }

    // Step 2: Fetch related API methods
    // $apiMethods = Apimethod::where('apivendor_ID', $apiVendor->id)
    //     ->select('id', 'method_name', 'http_method', 'endpoint', 'description', 'apivendor_ID')
    //     ->get();

        $apiMethods = DB::table('apimethods')
        ->where('apivendor_ID', $apiVendor->id)
        ->select('id', 'method_name', 'http_method', 'endpoint', 'description', 'apivendor_ID')
        ->get();

    // Step 3: Fetch all variables
    $variables = Variable::select('id', 'tags')->get();

    // Step 4: Fetch mappings for this branch and API vendor
    $mappings = Mapping::where('branch_ID', $branchId)
        ->where('apivendor_ID', $apiVendor->id)
        ->select('id', 'api_values', 'variable_ID', 'apivendor_ID', 'branch_ID')
        ->get();

  // Check if any of the required collections are empty
  if ($apiMethods->isEmpty() || $variables->isEmpty() || $mappings->isEmpty()) {
    return response()->json([
        'status' => false,
        'message' => "No API integration found for this branch.",
        'data' => []
    ], 404);
}

    return response()->json([
        'status' => true,
        'message' => 'Integration data fetched successfully.',
        'data' => [
            'apivendor' => $apiVendor,
            'apimethods' => $apiMethods,
            'variables' => $variables,
            'mappings' => $mappings
        ]
    ]);
}



public function getApiVendorByBranch($branchId)
{
    try {
        // Attempt to fetch the API vendor data for the given branch ID
        $apiVendor = Apivendor::where('branches_ID', $branchId)->first();

        if ($apiVendor) {
            return response()->json([
                'status' => true,
                'message' => 'API vendor integration found.',
                'data' => [
                    'id' => $apiVendor->id,
                    'api_key' => $apiVendor->api_key,
                    'api_base_url' => $apiVendor->api_base_url,
                    'api_auth_method' => $apiVendor->api_auth_method,
                    'api_version' => $apiVendor->api_version,
                    'vendor_integration_status' => $apiVendor->vendor_integration_status,
                    'response_format' => $apiVendor->response_format,
                    'branches_ID' => $apiVendor->branches_ID,
                    'created_at' => $apiVendor->created_at,
                    'updated_at' => $apiVendor->updated_at,
                ]
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => 'No API vendor integration found for this branch.',
                'data' => null
            ], 404);
        }

    } catch (\Exception $e) {
        Log::error('Error fetching API vendor integration: ' . $e->getMessage());

        return response()->json([
            'status' => false,
            'message' => 'An error occurred while fetching the API vendor integration.',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function storeApiVendor(Request $request)
{
    try {
        // Log the full incoming request payload
        Log::info('Incoming request to storeApiVendor:', $request->all());

        $validated = $request->validate([
            'api_key' => 'required|unique:apivendor,api_key',
            'api_base_url' => 'nullable|string',
            'api_auth_method' => 'nullable|string|max:50',
            'api_version' => 'nullable|string|max:10',
            'vendor_integration_status' => 'nullable|string|max:50',
            'response_format' => 'nullable|in:JSON,XML',
            'branches_ID' => 'required|exists:branches,id',
        ]);

        $vendor = Apivendor::create([
            'api_key' => $validated['api_key'],
            'api_base_url' => $validated['api_base_url'] ?? null,
            'api_auth_method' => $validated['api_auth_method'] ?? null,
            'api_version' => $validated['api_version'] ?? null,
            'vendor_integration_status' => $validated['vendor_integration_status'] ?? 'Active',
            'response_format' => $validated['response_format'] ?? 'JSON',
            'branches_ID' => $validated['branches_ID'],
            // 'created_at' => Carbon::now(),
            // 'updated_at' => Carbon::now(),
        ]);

        Log::info('API Vendor saved:', $vendor->toArray());

        return response()->json([
            'status' => true,
            'message' => 'API vendor details saved successfully.',
             'data' => $vendor
        ]);

    } catch (Exception $e) {
        Log::error('Failed to save API Vendor: ' . $e->getMessage());

        return response()->json([
            'status' => false,
            'message' => 'Failed to save API vendor details.',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function updateApiVendor(Request $request, $id)
{
    try {
        // Log incoming request
        Log::info("Incoming request to updateApiVendor (ID: $id):", $request->all());

        $validated = $request->validate([
            'api_key' => 'required|string|unique:apivendor,api_key,' . $id,
            'api_base_url' => 'nullable|string',
            'api_auth_method' => 'nullable|string|max:50',
            'api_version' => 'nullable|string|max:10',
            'vendor_integration_status' => 'nullable|string|max:50',
            'response_format' => 'nullable|in:JSON,XML',
            'branches_ID' => 'required|integer|exists:branches,id',
        ]);

        $vendor = Apivendor::find($id);

        if (!$vendor) {
            Log::warning("API Vendor with ID $id not found.");
            return response()->json([
                'status' => false,
                'message' => 'API Vendor not found.'
            ], 404);
        }

        $vendor->update([
            'api_key' => $validated['api_key'],
            'api_base_url' => $validated['api_base_url'] ?? null,
            'api_auth_method' => $validated['api_auth_method'] ?? null,
            'api_version' => $validated['api_version'] ?? null,
            'vendor_integration_status' => $validated['vendor_integration_status'] ?? 'Active',
            'response_format' => $validated['response_format'] ?? 'JSON',
            'branches_ID' => $validated['branches_ID'],
        ]);

        Log::info("API Vendor updated successfully (ID: $id):", $vendor->toArray());

        return response()->json([
            'status' => true,
            'message' => 'API vendor details updated successfully.',
            'data' => $vendor
        ], 200);

    } catch (\Exception $e) {
        Log::error("Failed to update API Vendor (ID: $id): " . $e->getMessage());

        return response()->json([
            'status' => false,
            'message' => 'Failed to update API vendor details.',
            'error' => $e->getMessage()
        ], 500);
    }
}

// public function updateApiVendor(Request $request, $id)
// {
//     $validated = $request->validate([
//         'api_key' => 'required|string|unique:apivendor,api_key,' . $id,
//         'api_base_url' => 'nullable|string',
//         'api_auth_method' => 'nullable|string|max:50',
//         'api_version' => 'nullable|string|max:10',
//         'vendor_integration_status' => 'nullable|string|max:50',
//         'response_format' => 'nullable|in:JSON,XML',
//         'branches_ID' => 'required|integer',
//     ]);

//     $updated = DB::table('apivendor')->where('id', $id)->update($validated);

//     if ($updated) {
//         return response()->json(['message' => 'API Vendor updated successfully.'], 200);
//     } else {
//         return response()->json(['message' => 'No changes or vendor not found.'], 404);
//     }
// }

public function getStandardApiMethods()
{
    // Fetch methods from any vendor (e.g., the first vendor with methods)
    $methods = DB::table('apimethods')
        ->select('method_name', 'http_method','id')
        ->distinct()
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'Standard method templates fetched successfully.',
        'data' => $methods
    ]);
}
public function saveApiMethods(Request $request, $apivendorId)
{
    $methods = $request->input('methods'); // array of methods
    Log::info('Incoming request to storeApiVendor:', $request->all());
    foreach ($methods as $method) {
        // Apimethod::create([
        //     'method_name' => $method['method_name'],
        //     'http_method' => $method['http_method'],
        //     'endpoint' => $method['endpoint'],
        //     'description' => $method['description'],
        //     'apivendor_ID' => $apivendorId,
        // ]);

        $insertedId = DB::table('apimethods')->insertGetId([
            'method_name' => $method['method_name'],
            'http_method' => $method['http_method'],
            'endpoint' => $method['endpoint'],
            'description' => $method['description'],
            'apivendor_ID' => $apivendorId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Log::info("Inserted API Method with ID: $insertedId");


    }

    return response()->json([
        'status' => true,
        'message' => 'API methods saved successfully.'
    ]);
}

public function updateApiMethod(Request $request, $id)
{
    Log::info("Incoming request to update API Method ID: $id", $request->all());

    $validated = $request->validate([
        'method_name' => 'required|string|max:100',
        'http_method' => 'required|in:GET,POST,PUT,DELETE',
        'endpoint' => 'required|string',
        'description' => 'nullable|string',
    ]);

    $affected = DB::table('apimethods')
        ->where('id', $id)
        ->update([
            'method_name' => $validated['method_name'],
            'http_method' => $validated['http_method'],
            'endpoint' => $validated['endpoint'],
            'description' => $validated['description'],
            'updated_at' => now()
        ]);

    if ($affected) {
        return response()->json([
            'status' => true,
            'message' => 'API method updated successfully.'
        ]);
    } else {
        return response()->json([
            'status' => false,
            'message' => 'No changes made or method not found.'
        ], 404);
    }
}


public function saveNewApiMethods(Request $request, $apivendorId = 0)
{
    $methods = $request->input('methods'); // array of methods
    Log::info('Incoming request to saveNewApiMethods:', $request->all());

    foreach ($methods as $method) {
        $methodName = $method['method_name'] ?? 'Unnamed Method';
        $httpMethod = $method['http_method'] ?? 'GET';

        // Default endpoint: based on method name
        $endpoint = $method['endpoint'] ?? 'api/' . strtolower(str_replace(' ', '_', $methodName));

        // Default description: fallback if not provided
        $description = $method['description'] ?? 'No description provided';

        // Prefer URL param, fallback to body value or default 0
        $vendorId = $apivendorId !== 0 ? $apivendorId : ($method['apivendor_ID'] ?? 0);

        $insertedId = DB::table('apimethods')->insertGetId([
            'method_name' => $methodName,
            'http_method' => $httpMethod,
            'endpoint' => $endpoint,
            'description' => $description,
            'apivendor_ID' => $vendorId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Log::info("Inserted API Method with ID: $insertedId");
        Log::info("Inserted methodName: $methodName");
        Log::info("Inserted vendorId: $vendorId");
        Log::info("Inserted httpMethod: $httpMethod");
        Log::info("Inserted endpoint: $endpoint");
        Log::info("Inserted description: $description");


    }

    return response()->json([
        'status' => true,
        'message' => 'API methods saved successfully.'
    ]);
}



// public function getApiMethodsByVendor($apivendorId)
// {
//    // $methods = Apimethod::where('apivendor_ID', $apivendorId)->get();

//     $methods = DB::table('apimethods')->where('apivendor_ID', $apivendorId)->get();

//     return response()->json([
//         'status' => true,
//         'methods' => $methods
//     ]);
// }
public function getApiMethodsByVendor($apivendorId)
{
    $methods = DB::table('apimethods')->where('apivendor_ID', $apivendorId)->get();

    if ($methods->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'No API methods found for the given API Vendor ID.',
            'methods' => []
        ], 404); // optional: 404 Not Found status code
    }

    return response()->json([
        'status' => true,
        'message' => 'API methods retrieved successfully.',
        'methods' => $methods
    ]);
}


public function addVariable(Request $request)
{
    Log::info("Incoming request to Add New Variable", $request->all());

    $validated = $request->validate([
        'tags' => 'required|string|unique:variables,tags'
    ]);

    $variable = DB::table('variables')->insert($validated);

    return response()->json(['message' => 'Variable added successfully'], 201);
}

public function getAllVariables()
{
    $variables = Variable::select('id', 'tags')->get();

    if ($variables->isEmpty()) {
        return response()->json(['status' => false, 'message' => 'No variables found.']);
    }

    return response()->json(['success' => true, 'data' => $variables]);
}

public function getMappings($branchId, $apivendorId)
{
    $mappings = Mapping::where('branch_ID', $branchId)
        ->where('apivendor_ID', $apivendorId)
        ->select('id', 'api_values', 'variable_ID', 'apivendor_ID', 'branch_ID')
        ->get();

    if ($mappings->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No mappings found.',
            'data' => []
        ], 200);
    }

    return response()->json([
        'success' => true,
        'message' => 'Mappings retrieved successfully.',
        'data' => $mappings
    ], 200);
}


public function saveVariableMappings(Request $request)
{
    Log::info('Incoming request to storeApiVendor:', $request->all());
    $data = $request->validate([
        'branch_ID' => 'required|integer',
        'apivendor_ID' => 'required|integer',
        'mappings' => 'required|array',
        'mappings.*.variable_ID' => 'required|integer',
        'mappings.*.api_values' => 'required|string|max:255',
    ]);

    $savedMappings = [];

    foreach ($data['mappings'] as $mapping) {
        $saved = Mapping::updateOrCreate(
            [
                'branch_ID' => $data['branch_ID'],
                'apivendor_ID' => $data['apivendor_ID'],
                'variable_ID' => $mapping['variable_ID']
            ],
            [
                'api_values' => $mapping['api_values']
            ]
        );

        $savedMappings[] = $saved;
    }

    return response()->json([
        'success' => true,
        'message' => 'Mappings saved successfully.',
        'data' => $savedMappings
    ], 200);
}

public function updateVariableMapping(Request $request, $id)
{
    Log::info('Incoming update request for mapping ID ' . $id, $request->all());

    $data = $request->validate([
        'api_values' => 'required|string|max:255',
    ]);

    $mapping = Mapping::find($id);

    if (!$mapping) {
        return response()->json([
            'success' => false,
            'message' => 'Mapping not found.'
        ], 404);
    }

    $mapping->api_values = $data['api_values'];
    $mapping->save();

    return response()->json([
        'success' => true,
        'message' => 'Mapping updated successfully.',
        'data' => $mapping
    ], 200);
}

////////////////
////////////////
///////////////
////////////////



////////////
public function getShopsAndCategories($vendorId)
{
    $shops = DB::table('shops')
        ->join('shopcategory', 'shops.shopcategory_ID', '=', 'shopcategory.id')
        ->where('shops.vendors_ID', $vendorId)
        ->select('shops.*', 'shopcategory.name as category_name')
        ->get();

    return response()->json($shops);
}


public function getBranches($vendorId, $shopId)
{
    $branches = DB::table('branches')
        ->join('shops', 'branches.shops_ID', '=', 'shops.id')
        ->where('shops.vendors_ID', $vendorId)
        ->where('shops.id', $shopId)
        ->select('branches.*')
        ->get();

    // Add full URL to branch_picture
    $branches->transform(function ($branch) {
        $branch->branch_picture = $branch->branch_picture
            ? url(Storage::url($branch->branch_picture))
            : null;
        return $branch;
    });

    return response()->json($branches);
}


//add api vendor
// public function addApiVendor(Request $request)
// {
//     try {
//         // Log the incoming request
//         \Log::info('Request Data:', $request->all());

//         // Validate the request
//         $validated = $request->validate([
//             'branches_ID' => 'required|exists:branches, id',
//             'api_key' => 'required|string|unique:apivendor, api_key',
//             'api_base_url' => 'required|url',
//             'api_auth_method' => 'required|string',
//             'api_version' => 'required|string',
//             'vendor_integration_status' => 'required|in:Active, Inactive',
//             'response_format' => 'required|in:JSON, XML'
//         ]);

//         // Insert into the database and get the ID
//         $apiVendorId = DB::table('apivendor')->insertGetId($validated);

//         // Return success response with the new ID
//         return response()->json([
//             'message' => 'API Vendor added successfully',
//             'apiVendorId' => $apiVendorId,
//             'data' => $validated
//         ], 201);
//     } catch (\Exception $e) {
//         // Log the exception
//         \Log::error('Error adding API Vendor:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

//         // Return error response
//         return response()->json([
//             'error' => 'An error occurred while adding the API Vendor.',
//             'details' => $e->getMessage()
//         ], 500);
//     }
// }



// public function addApiMethod(Request $request)
// {
//     $validated = $request->validate([
//         'apivendor_ID' => 'required|exists:apivendor, id',
//         'method_name' => 'required|string',
//         'http_method' => 'required|in:GET, POST, PUT, DELETE',
//         'endpoint' => 'required|string',
//         'description' => 'nullable|string'
//     ]);

//     $apiMethod = DB::table('apimethods')->insert($validated);

//     return response()->json(['message' => 'API Method added successfully'], 201);
// }

// public function getMethodsByApiVendorId(Request $request, $apivendor_id)
// {
//     try {
//         // Validate that the apivendor_id exists
//         $apiVendorExists = DB::table('apivendor')->where('id', $apivendor_id)->exists();

//         if (!$apiVendorExists) {
//             return response()->json([
//                 'error' => 'API Vendor not found.',
//                 'details' => 'No API Vendor exists with the provided ID.'
//             ], 404);
//         }

//         // Fetch all methods associated with the apivendor_id
//         $methods = DB::table('apimethods')
//             ->where('apivendor_id', $apivendor_id)
//             ->get();

//         // Check if methods exist
//         if ($methods->isEmpty()) {
//             return response()->json([
//                 'message' => 'No methods found for the specified API Vendor.',
//                 'apivendor_id' => $apivendor_id
//             ], 404);
//         }

//         // Return success response with methods
//         return response()->json([
//             'message' => 'Methods retrieved successfully.',
//             'apivendor_id' => $apivendor_id,
//             'methods' => $methods
//         ], 200);
//     } catch (\Exception $e) {
//         // Log the exception
//         \Log::error('Error fetching methods for API Vendor:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

//         // Return error response
//         return response()->json([
//             'error' => 'An error occurred while fetching methods.',
//             'details' => $e->getMessage()
//         ], 500);
//     }
// }




// public function addMapping(Request $request)
// {
//     $validated = $request->validate([
//         'variable_ID' => 'required|exists:variables, id',
//         'api_values' => 'required|string',
//         'apivendor_ID' => 'required|exists:apivendor, id',
//         'branch_ID' => 'required|exists:branches, id'
//     ]);

//     $mapping = DB::table('mapping')->insert($validated);

//     return response()->json(['message' => 'Mapping added successfully'], 201);
// }



///////////////////////////////////////////////////////////////////
//////////////////////  COURIER ORDER ITEM  ///////////////////////
///////////////////////////////////////////////////////////////////
    

// Function to add a new courier item category
public function addCourierItemCategory(Request $request)
{
    // Validate input
    $request->validate([
        'category_name' => 'required|string|max:255',
    ]);

    // Create a new CourierItemCategory
    $category = new CourierItemCategory();
    $category->category_name = $request->category_name;  // Change 'name' to 'category_name'
    $category->save();

    return response()->json(['message' => 'Courier item category added successfully!', 'category' => $category]);
}



public function addCourierItem(Request $request)
{
    // Validate input
    $validator = Validator::make($request->all(), [
        'courieritemcategory_ID' => 'required|exists:courieritemcategory, id', // Ensure category exists
        'item_name' => 'required|string|max:255', // Ensure item name is provided
        'additonal_info' => 'required|string|max:255', // Ensure additional info is provided
    ]);

    // If validation fails, return the errors with a 422 status code
    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    // Create a new CourierItem if validation passes
    $item = new CourierItem();
    $item->courieritemcategory_ID = $request->courieritemcategory_ID;
    $item->item_name = $request->item_name;
    $item->additonal_info = $request->additonal_info;
    $item->save();

    return response()->json([
        'status' => 'success',
        'message' => 'Courier item added successfully!',
        'item' => $item
            ] );
    }






    public function getAdminStats()
    {
        // Total users
        $totalUsers = DB::table('lmd_users')->count();
    
        // Users by role
        $userRoles = DB::table('lmd_users')
            ->select('lmd_user_role', DB::raw('count(*) as count'))
            ->groupBy('lmd_user_role')
            ->pluck('count', 'lmd_user_role');
    
        // Orders
        $totalOrders = DB::table('orders')->count();
        $ordersByStatus = DB::table('orders')
            ->select('order_status', DB::raw('count(*) as count'))
            ->groupBy('order_status')
            ->pluck('count', 'order_status');
    
        // Shops & Branches
        $totalShops = DB::table('shops')->count();
        $totalBranches = DB::table('branches')->count();
    
        // Vendors by branch approval status
        $vendorsByApproval = DB::table('branches')
            ->select('approval_status', DB::raw('count(*) as count'))
            ->groupBy('approval_status')
            ->pluck('count', 'approval_status');
    
        return response()->json([
            'total_users' => $totalUsers,
            'users_by_role' => [
                'customer' => $userRoles['customer'] ?? 0,
                'vendor' => $userRoles['vendor'] ?? 0,
                'organization' => $userRoles['organization'] ?? 0,
                'deliveryboy' => $userRoles['deliveryboy'] ?? 0,
                'admin' => $userRoles['admin'] ?? 0,
            ],
            'total_orders' => $totalOrders,
            'orders_by_status' => [
                'cancelled' => $ordersByStatus['cancelled'] ?? 0,
                'pending' => $ordersByStatus['pending'] ?? 0,
                'confirmed' => $ordersByStatus['confirmed'] ?? 0,
            ],
            'total_shops' => $totalShops,
            'total_branches' => $totalBranches,
            'branches_by_approval' => [
                'pending' => $vendorsByApproval['pending'] ?? 0,
                'approved' => $vendorsByApproval['approved'] ?? 0,
                'rejected' => $vendorsByApproval['rejected'] ?? 0,
            ],
        ]);
    }
    
    
}