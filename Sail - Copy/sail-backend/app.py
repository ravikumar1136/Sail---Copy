from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import pandas as pd
from datetime import datetime, timedelta
import os
import json
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import random
import jwt
from functools import wraps

app = Flask(__name__)
CORS(app, supports_credentials=True)

# JWT Secret Key
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')

# MySQL Connection Pool
db_config = {
    'host': os.environ.get('MYSQL_HOST', 'localhost'),
    'user': os.environ.get('MYSQL_USER', 'root'),
    'password': os.environ.get('MYSQL_PASSWORD', '6562'),
    'database': os.environ.get('MYSQL_DATABASE', 'my_app_db'),
}

try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="sail_pool",
        pool_size=5,
        **db_config
    )
    print("MySQL Connection Pool created successfully")
except Exception as e:
    print(f"Error creating MySQL Connection Pool: {e}")
    # Create a fallback in-memory storage if database connection fails
    users_db = {}
    orders_db = {}

# Initialize database tables
def init_database():
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Create orders table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                grade VARCHAR(50) NOT NULL,
                thickness VARCHAR(50) NOT NULL,
                width VARCHAR(50) NOT NULL,
                length VARCHAR(50),
                finish VARCHAR(50),
                quality VARCHAR(50),
                edge VARCHAR(50),
                b_quantity VARCHAR(50),
                customer VARCHAR(255) NOT NULL,
                ssp_ro_id VARCHAR(50),
                release_date DATE,
                required_quantity VARCHAR(50) NOT NULL,
                mou VARCHAR(255),
                remarks TEXT,
                delivery_days INT NOT NULL,
                expected_delivery_date DATETIME,
                status VARCHAR(50) DEFAULT 'Processing',
                created_at DATETIME NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        # Create stock_data table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stock_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                TYP VARCHAR(10),
                DTP VARCHAR(20),
                PKT VARCHAR(20),
                GRD VARCHAR(20),
                FIN VARCHAR(20),
                THK VARCHAR(20),
                WIDT VARCHAR(20),
                LNGT VARCHAR(20),
                PWT VARCHAR(20),
                QLY VARCHAR(10),
                EDGE VARCHAR(10),
                ASP VARCHAR(20),
                HRC1 VARCHAR(20),
                BL VARCHAR(10),
                SAL VARCHAR(50),
                STORE VARCHAR(50),
                NICKEL VARCHAR(20),
                COILNO VARCHAR(20)
            )
        """)
        
        # Check if stock_data table is empty
        cursor.execute("SELECT COUNT(*) FROM stock_data")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Load stock data from CSV
            try:
                csv_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'stock-data.csv')
                stock_data = pd.read_csv(csv_path)
                
                # Insert stock data into the database
                for _, row in stock_data.iterrows():
                    cursor.execute("""
                        INSERT INTO stock_data (
                            TYP, DTP, PKT, GRD, FIN, THK, WIDT, LNGT, PWT, QLY, EDGE, 
                            ASP, HRC1, BL, SAL, STORE, NICKEL, COILNO
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        row.get('TYP', ''), row.get('DTP', ''), row.get('PKT', ''), 
                        row.get('GRD', ''), row.get('FIN', ''), row.get('THK', ''), 
                        row.get('WIDT', ''), row.get('LNGT', ''), row.get('PWT', ''), 
                        row.get('QLY', ''), row.get('EDGE', ''), row.get('ASP', ''), 
                        row.get('HRC1', ''), row.get('BL', ''), row.get('SAL', ''), 
                        row.get('STORE', ''), row.get('NICKEL', ''), row.get('COILNO', '')
                    ))
            except Exception as e:
                print(f"Error loading stock data from CSV: {e}")
                
                # Insert sample stock data
                sample_data = [
                    ('C', '04/06/2021', 'FB81774', '201', '2D', '1', '1250', '', '0.4', 'S', 'M', 'SSP', '122738', 'FALSE', 'TRUE', '', '3.55', '122738'),
                    ('C', '10/08/2014', 'FA68412', '201', '2D', '2', '1250', '', '1.016', 'P', 'M', 'SSP', '121096 B', 'FALSE', 'TRUE', '', '3.57', '121096 B'),
                    ('C', '10/08/2014', 'FA68413', '201', '2D', '2', '1250', '', '1.365', 'P', 'M', 'SSP', '121096 B', 'FALSE', 'REMOTE HRC', '', '3.57', '121096 B'),
                    ('C', '10/06/2021', 'FB82000', '201', '2D', '2', '1250', '', '0.972', 'C', 'M', 'SSP', '121100', 'FALSE', 'HRC CRM', 'Store Stock', '3.57', '121100'),
                    ('C', '24/02/2024', 'FC22581', '316', '2D', '0.3', '1250', '', '2.159', 'P', 'M', 'SSP', '219930', 'FALSE', 'HRCS', '', '1.5', '219930')
                ]
                
                for data in sample_data:
                    cursor.execute("""
                        INSERT INTO stock_data (
                            TYP, DTP, PKT, GRD, FIN, THK, WIDT, LNGT, PWT, QLY, EDGE, 
                            ASP, HRC1, BL, SAL, STORE, NICKEL, COILNO
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, data)
        
        conn.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from cookies
        if 'auth_token' in request.cookies:
            token = request.cookies.get('auth_token')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            
            # Get user from database
            conn = connection_pool.get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (data['id'],))
            current_user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400
        
        # Get user from database
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({"message": "Invalid email or password"}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, JWT_SECRET)
        
        response = jsonify({
            "message": "Login successful",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email']
            }
        })
        
        # Set cookie
        response.set_cookie(
            'auth_token',
            token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60*60*24  # 1 day
        )
        
        return response
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"message": "An error occurred during login"}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not name or not email or not password:
            return jsonify({"message": "Name, email, and password are required"}), 400
        
        # Check if user already exists
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({"message": "User with this email already exists"}), 409
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = generate_password_hash(password)
        created_at = datetime.now()
        
        cursor.execute(
            "INSERT INTO users (id, name, email, password, created_at) VALUES (%s, %s, %s, %s, %s)",
            (user_id, name, email, hashed_password, created_at)
        )
        conn.commit()
        cursor.close()
        conn.close()
        
        # Generate JWT token
        token = jwt.encode({
            'id': user_id,
            'name': name,
            'email': email,
            'exp': datetime.utcnow() + timedelta(days=1)
        }, JWT_SECRET)
        
        response = jsonify({
            "message": "User created successfully",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        })
        
        # Set cookie
        response.set_cookie(
            'auth_token',
            token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=60*60*24  # 1 day
        )
        
        return response, 201
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"message": "An error occurred during signup"}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Logout successful"})
    response.delete_cookie('auth_token')
    return response

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    token = request.cookies.get('auth_token')
    
    if not token:
        return jsonify({"message": "Not authenticated"}), 401
    
    try:
        # Decode token
        data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        
        # Get user from database
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (data['id'],))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        return jsonify({"user": user})
    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({"message": "Invalid token"}), 401

@app.route('/api/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC", (current_user['id'],))
        orders = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({"orders": orders})
    except Exception as e:
        print(f"Get orders error: {e}")
        return jsonify({"message": "An error occurred while fetching orders"}), 500

@app.route('/api/orders', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['grade', 'thickness', 'width', 'customer', 'requiredQuantity']
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"Missing required field: {field}"}), 400
        
        # Create order ID
        order_id = str(uuid.uuid4())
        created_at = datetime.now()
        
        # Check stock data for delivery days calculation
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM stock_data WHERE GRD = %s LIMIT 1", (data['grade'],))
        stock_item = cursor.fetchone()
        
        # Calculate delivery days
        delivery_days = 0
        if stock_item:
            sal_value = stock_item['SAL']
            
            if sal_value == 'TRUE':
                delivery_days = 0
            elif 'KICKBACK SLAB STK' in sal_value or 'SLAB STK' in sal_value:
                delivery_days = random.randint(60, 90)
            elif any(store_type in sal_value for store_type in ['HRC HRM', 'HRCS', 'HRCS JOBWORK', 'HRSS', 'REMOTE HRC']):
                delivery_days = random.randint(45, 60)
            elif any(store_type in sal_value for store_type in ['HRC CRM', 'COIN BLANK STK', 'PACKET OPEN WIP']):
                delivery_days = 30
            else:
                delivery_days = random.randint(75, 100)
        else:
            delivery_days = random.randint(75, 100)
        
        # Calculate expected delivery date
        release_date = datetime.strptime(data.get('releaseDate', created_at.strftime('%Y-%m-%d')), '%Y-%m-%d')
        expected_delivery_date = release_date + timedelta(days=delivery_days)
        
        # Insert order into database
        cursor.execute("""
            INSERT INTO orders (
                id, user_id, grade, thickness, width, length, finish, quality, edge, 
                b_quantity, customer, ssp_ro_id, release_date, required_quantity, 
                mou, remarks, delivery_days, expected_delivery_date, status, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            order_id,
            current_user['id'],
            data['grade'],
            data['thickness'],
            data['width'],
            data.get('length', ''),
            data.get('finish', ''),
            data.get('quality', ''),
            data.get('edge', ''),
            data.get('bQuantity', ''),
            data['customer'],
            data.get('sspRoId', ''),
            release_date,
            data['requiredQuantity'],
            data.get('mou', ''),
            data.get('remarks', ''),
            delivery_days,
            expected_delivery_date,
            'Processing',
            created_at
        ))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Order created successfully",
            "order": {
                "id": order_id,
                "userId": current_user['id'],
                "grade": data['grade'],
                "thickness": data['thickness'],
                "width": data['width'],
                "deliveryDays": delivery_days,
                "expectedDeliveryDate": expected_delivery_date.isoformat(),
                "status": "Processing",
                "createdAt": created_at.isoformat()
            }
        }), 201
    except Exception as e:
        print(f"Create order error: {e}")
        return jsonify({"message": "An error occurred while creating the order"}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE id = %s AND user_id = %s", (order_id, current_user['id']))
        order = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not order:
            return jsonify({"message": "Order not found"}), 404
        
        return jsonify({"order": order})
    except Exception as e:
        print(f"Get order error: {e}")
        return jsonify({"message": "An error occurred while fetching the order"}), 500

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    try:
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (current_user['id'],))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user:
            return jsonify({"message": "User not found"}), 404
        
        return jsonify({"user": user})
    except Exception as e:
        print(f"Get profile error: {e}")
        return jsonify({"message": "An error occurred while fetching profile data"}), 500

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        
        if not name or not email:
            return jsonify({"message": "Name and email are required"}), 400
        
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if email is already taken by another user
        if email != current_user['email']:
            cursor.execute("SELECT * FROM users WHERE email = %s AND id != %s", (email, current_user['id']))
            existing_user = cursor.fetchone()
            
            if existing_user:
                cursor.close()
                conn.close()
                return jsonify({"message": "Email is already taken"}), 409
        
        # Update user profile
        cursor.execute("UPDATE users SET name = %s, email = %s WHERE id = %s", (name, email, current_user['id']))
        conn.commit()
        
        # Get updated user data
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (current_user['id'],))
        updated_user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": updated_user
        })
    except Exception as e:
        print(f"Update profile error: {e}")
        return jsonify({"message": "An error occurred while updating profile"}), 500

@app.route('/api/profile/password', methods=['PUT'])
@token_required
def update_password(current_user):
    try:
        data = request.json
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        if not current_password or not new_password:
            return jsonify({"message": "Current password and new password are required"}), 400
        
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user's current password hash
        cursor.execute("SELECT password FROM users WHERE id = %s", (current_user['id'],))
        user = cursor.fetchone()
        
        if not user:
            cursor.close()
            conn.close()
            return jsonify({"message": "User not found"}), 404
        
        # Verify current password
        if not check_password_hash(user['password'], current_password):
            cursor.close()
            conn.close()
            return jsonify({"message": "Current password is incorrect"}), 401
        
        # Hash new password
        hashed_password = generate_password_hash(new_password)
        
        # Update password
        cursor.execute("UPDATE users SET password = %s WHERE id = %s", (hashed_password, current_user['id']))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Password updated successfully"})
    except Exception as e:
        print(f"Update password error: {e}")
        return jsonify({"message": "An error occurred while updating password"}), 500

@app.route('/api/stock/check', methods=['GET'])
@token_required
def check_stock(current_user):
    try:
        grade = request.args.get('grade')
        
        if not grade:
            return jsonify({"message": "Grade parameter is required"}), 400
        
        conn = connection_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM stock_data WHERE GRD = %s LIMIT 1", (grade,))
        stock_item = cursor.fetchone()
        cursor.close()
        conn.close()
        
        # Calculate delivery days
        delivery_days = 0
        delivery_message = ""
        
        if stock_item:
            sal_value = stock_item['SAL']
            
            if sal_value == 'TRUE':
                delivery_days = 0
                delivery_message = "Material Available, It will be dispatched soon"
            elif 'KICKBACK SLAB STK' in sal_value or 'SLAB STK' in sal_value:
                delivery_days = random.randint(60, 90)
                delivery_message = f"Processing time: {delivery_days} days"
            elif any(store_type in sal_value for store_type in ['HRC HRM', 'HRCS', 'HRCS JOBWORK', 'HRSS', 'REMOTE HRC']):
                delivery_days = random.randint(45, 60)
                delivery_message = f"Processing time: {delivery_days} days"
            elif any(store_type in sal_value for store_type in ['HRC CRM', 'COIN BLANK STK', 'PACKET OPEN WIP']):
                delivery_days = 30
                delivery_message = f"Processing time: {delivery_days} days"
            else:
                delivery_days = random.randint(75, 100)
                delivery_message = f"Processing time: {delivery_days} days"
        else:
            delivery_days = random.randint(75, 100)
            delivery_message = f"Processing time: {delivery_days} days"
        
        # Calculate expected delivery date
        expected_delivery_date = datetime.now() + timedelta(days=delivery_days)
        
        return jsonify({
            "grade": grade,
            "deliveryDays": delivery_days,
            "deliveryMessage": delivery_message,
            "expectedDeliveryDate": expected_delivery_date.isoformat()
        })
    except Exception as e:
        print(f"Check stock error: {e}")
        return jsonify({"message": "An error occurred while checking stock"}), 500

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Run the app
    app.run(debug=True, port=5000)
