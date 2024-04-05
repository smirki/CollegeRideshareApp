from flask import Flask, request, abort
from flask_cors import CORS

app = Flask(__name__, static_url_path='', 
            static_folder='Tests',)
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SECRET_KEY'] = 'mysecretkey'

# Update CORS configuration to include the new origin
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "*", " http://localhost:8081", "https://expo.saipriya.org"]}})

import Database.db
import Routes.classic_routes

from Services.ticketing_service import ticketing_service
from Routes.auth_routes import auth_bp

# Register the blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(ticketing_service, url_prefix='/tickets')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
