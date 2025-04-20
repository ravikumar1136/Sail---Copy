from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
from datetime import datetime, timedelta
import os
import json
import uuid
import random

app = Flask(__name__)
CORS(app, supports_credentials=True)

# SQLite database path
DB_PATH = 'sail.db'

# Initialize database tables
def init_database():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create orders table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                grade TEXT NOT NULL,
                thickness TEXT NOT NULL,
                width TEXT NOT NULL,
                length TEXT,
                finish TEXT,
                quality TEXT,
                edge TEXT,
                b_quantity TEXT,
                customer TEXT NOT NULL,
                ssp_ro_id TEXT,
                release_date TEXT,
                required_quantity TEXT NOT NULL,
                mou TEXT,
                remarks TEXT,
                delivery_days INTEGER NOT NULL,
                expected_delivery_date TEXT,
                status TEXT DEFAULT 'Processing',
                created_at TEXT NOT NULL,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create stock_data table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stock_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                TYP TEXT,
                DTP TEXT,
                PKT TEXT,
                GRD TEXT,
                FIN TEXT,
                THK TEXT,
                WIDT TEXT,
                LNGT TEXT,
                PWT TEXT,
                QTY TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

# Initialize database on startup
init_database()

# Helper function to get a connection
def get_db_connection():
    try:
        return sqlite3.connect(DB_PATH)
    except Exception as e:
        print(f"Error getting database connection: {e}")
        return None

# Helper function to generate a unique ID
def generate_id():
    return str(uuid.uuid4())

# Helper function to get current timestamp
def get_current_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Routes
@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
        orders = cursor.fetchall()
        
        # Convert to list of dictionaries
        columns = [description[0] for description in cursor.description]
        orders_list = []
        for order in orders:
            orders_list.append(dict(zip(columns, order)))
        
        return jsonify(orders_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['grade', 'thickness', 'width', 'customer', 'required_quantity', 'delivery_days']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Generate a unique ID for the order
        order_id = generate_id()
        
        # Calculate expected delivery date
        delivery_days = int(data.get('delivery_days', 0))
        expected_delivery_date = datetime.now() + timedelta(days=delivery_days)
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor()
        
        # Insert the order into the database
        cursor.execute("""
            INSERT INTO orders (
                id, user_id, grade, thickness, width, length, finish, quality, 
                edge, b_quantity, customer, ssp_ro_id, release_date, required_quantity, 
                mou, remarks, delivery_days, expected_delivery_date, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            order_id, 
            "anonymous", # Default user_id for anonymous users
            data.get('grade'),
            data.get('thickness'),
            data.get('width'),
            data.get('length'),
            data.get('finish'),
            data.get('quality'),
            data.get('edge'),
            data.get('b_quantity'),
            data.get('customer'),
            data.get('ssp_ro_id'),
            data.get('release_date'),
            data.get('required_quantity'),
            data.get('mou'),
            data.get('remarks'),
            data.get('delivery_days'),
            expected_delivery_date.strftime('%Y-%m-%d %H:%M:%S'),
            'Processing',
            get_current_timestamp()
        ))
        
        conn.commit()
        
        return jsonify({
            "message": "Order created successfully",
            "order_id": order_id
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        
        if not order:
            return jsonify({"error": "Order not found"}), 404
            
        # Convert to dictionary
        columns = [description[0] for description in cursor.description]
        order_dict = dict(zip(columns, order))
        
        return jsonify(order_dict)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

@app.route('/api/stock/check', methods=['GET'])
def check_stock():
    try:
        # Get query parameters
        grade = request.args.get('grade')
        thickness = request.args.get('thickness')
        width = request.args.get('width')
        length = request.args.get('length')
        finish = request.args.get('finish')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        cursor = conn.cursor()
        
        # Build the query based on provided parameters
        query = "SELECT * FROM stock_data WHERE 1=1"
        params = []
        
        if grade:
            query += " AND GRD = ?"
            params.append(grade)
        if thickness:
            query += " AND THK = ?"
            params.append(thickness)
        if width:
            query += " AND WIDT = ?"
            params.append(width)
        if length:
            query += " AND LNGT = ?"
            params.append(length)
        if finish:
            query += " AND FIN = ?"
            params.append(finish)
            
        cursor.execute(query, params)
        stock_data = cursor.fetchall()
        
        # Convert to list of dictionaries
        columns = [description[0] for description in cursor.description]
        stock_list = []
        for stock in stock_data:
            stock_list.append(dict(zip(columns, stock)))
        
        return jsonify(stock_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    app.run(debug=True) 