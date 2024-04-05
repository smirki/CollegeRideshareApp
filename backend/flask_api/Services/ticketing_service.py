from flask import Blueprint, request, jsonify
from Database.db import db
from Routes.auth_routes import token_required
from bson import ObjectId

ticketing_service = Blueprint('ticketing_service', __name__)

@ticketing_service.route('/create-event', methods=['POST'])
@token_required
def create_event(current_user):
    data = request.json
    event = {
        'name': data['name'],
        'date': data['date'],
        'ticketPrice': data['ticketPrice'],
        'numberOfTickets': data['numberOfTickets'],
        'host': current_user['email'],
        'ticketsSold': 0,
        'registeredUsers': [],
        'category': 'Event',
        'password': data['password'],  # Add the password field
    }
    db.Events.insert_one(event)
    return jsonify({'success': True, 'message': 'Event created successfully', 'event': event}), 201


@ticketing_service.route('/register-event', methods=['POST'])
@token_required
def register_event(current_user):
    data = request.json
    event_id = ObjectId(data['eventId'])  # Convert the event ID to ObjectId
    user_email = current_user['email']

    event = db.Events.find_one({'_id': event_id})
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if user_email in event['registeredUsers']:
        return jsonify({'error': 'User already registered for this event'}), 409

    if event['ticketsSold'] >= event['numberOfTickets']:
        return jsonify({'error': 'No tickets available'}), 400

    db.Events.update_one({'_id': event_id}, {'$inc': {'ticketsSold': 1}, '$push': {'registeredUsers': user_email}})

    return jsonify({'success': True, 'message': 'Registered for the event successfully'}), 200


@ticketing_service.route('/user-events', methods=['GET'])
@token_required
def user_events(current_user):
    user_email = current_user['email']
    events = db.Events.find({'registeredUsers': user_email})
    # Convert ObjectId to string and return the events
    events_list = []
    for event in events:
        event['_id'] = str(event['_id'])
        events_list.append(event)
    return jsonify({'events': events_list}), 200


@ticketing_service.route('/check-in/<event_id>', methods=['POST'])
@token_required
def check_in(current_user, event_id):
    data = request.json
    password = data['password']
    user_email = current_user['email']

    event = db.Events.find_one({'_id': ObjectId(event_id)})
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if event['password'] != password:
        return jsonify({'error': 'Incorrect password'}), 403

    if user_email not in event['registeredUsers']:
        return jsonify({'error': 'User is not registered for this event'}), 404

    if 'checkedIn' not in event['registeredUsers'][user_email]:
        db.Events.update_one({'_id': ObjectId(event_id), 'registeredUsers.email': user_email},
                             {'$set': {'registeredUsers.$.checkedIn': True}})
        return jsonify({'success': True, 'message': 'Checked in successfully'}), 200
    else:
        return jsonify({'error': 'User already checked in'}), 409



@ticketing_service.route('/unregister-event', methods=['POST'])
@token_required
def unregister_event(current_user):
    data = request.json
    event_id = ObjectId(data['eventId'])  # Convert the event ID to ObjectId
    user_email = current_user['email']

    event = db.Events.find_one({'_id': event_id})
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if user_email not in event['registeredUsers']:
        return jsonify({'error': 'User is not registered for this event'}), 404

    db.Events.update_one({'_id': event_id}, {'$inc': {'ticketsSold': -1}, '$pull': {'registeredUsers': user_email}})

    return jsonify({'success': True, 'message': 'Unregistered from the event successfully'}), 200


@ticketing_service.route('/event/<event_id>', methods=['GET'])
@token_required
def event_details(current_user, event_id):
    event = db.Events.find_one({'_id': ObjectId(event_id)})
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    event['_id'] = str(event['_id'])  # Convert ObjectId to string
    return jsonify({'event': event}), 200

@ticketing_service.route('/destinations-and-events', methods=['GET'])
def get_destinations_and_events():
    # Hardcoded list of destinations and events
    data = [
        {'key': '1', 'title': 'AvidXchange Music Factory', 'time': '9 PM EST', 'backgroundColor': '#EBF8EE', 'category': 'Nightlife', 'latitude': 35.2401, 'longitude': -80.8451},
        {'key': '2', 'title': 'Bojangles Coliseum', 'time': '8 PM EST', 'backgroundColor': '#FD4E26', 'category': 'Nightlife', 'latitude': 35.2079, 'longitude': -80.7997},
        {'key': '3', 'title': 'Ink n Ivy', 'time': '10 PM EST', 'backgroundColor': '#EBF8EE', 'latitude': 35.2274, 'longitude': -80.8443},
        {'key': '4', 'title': 'Merchant & Trade', 'time': '7 PM EST', 'backgroundColor': '#FD4E26', 'latitude': 35.2279, 'longitude': -80.8433},
        {'key': '5', 'title': 'Middle C Jazz', 'time': '6 PM EST', 'backgroundColor': '#EBF8EE', 'latitude': 35.2215, 'longitude': -80.8457},
        {'key': '6', 'title': 'Nuvole Rooftop TwentyTwo', 'time': '8 PM EST', 'backgroundColor': '#FD4E26', 'latitude': 35.2278, 'longitude': -80.8431},
        {'key': '7', 'title': 'Ovens Auditorium', 'time': '9 PM EST', 'backgroundColor': '#EBF8EE', 'latitude': 35.2083, 'longitude': -80.7934},
        {'key': '8', 'title': 'Petra\'s', 'time': '10 PM EST', 'backgroundColor': '#FD4E26', 'latitude': 35.2204, 'longitude': -80.8128},
        {'key': '9', 'title': 'Pinhouse', 'time': '11 AM EST', 'backgroundColor': '#EBF8EE', 'latitude': 35.2099, 'longitude': -80.8126},
        {'key': '10', 'title': 'PNC Music Pavilion', 'time': '8 PM EST', 'backgroundColor': '#FD4E26', 'latitude': 35.3354, 'longitude': -80.7328},
        {'key': '10', 'title': 'PNC Music Pavilion', 'time': '8 PM EST', 'backgroundColor': '#FD4E26'},
        {'key': '11', 'title': 'Puttery', 'time': '7 PM EST', 'backgroundColor': '#EBF8EE'},
        {'key': '12', 'title': 'Skyla Credit Union Amphitheatre', 'time': '9 PM EST', 'backgroundColor': '#FD4E26'},
        {'key': '13', 'title': 'Society at 229', 'time': '10 PM EST', 'backgroundColor': '#EBF8EE'},
        {'key': '14', 'title': 'Spectrum Center', 'time': '8 PM EST', 'backgroundColor': '#FD4E26'},
        {'key': '15', 'title': 'SupperClub', 'time': '11 PM EST', 'backgroundColor': '#EBF8EE'},
        {'key': '16', 'title': 'The Amp Ballantyne', 'time': '9 PM EST', 'backgroundColor': '#FD4E26'},
        {'key': '17', 'title': 'The Comedy Zone', 'time': '8 PM EST', 'backgroundColor': '#EBF8EE'},
        {'key': '18', 'title': 'The Fillmore', 'time': '10 PM EST', 'backgroundColor': '#FD4E26'},
        {'key': '19', 'title': 'The Underground', 'time': '9 PM EST', 'backgroundColor': '#EBF8EE'},
        {'key': '20', 'title': 'The Union at Station West', 'time': '8 PM EST', 'backgroundColor': '#FD4E26'},
        {'key': '21', 'title': 'Charlotte Grocery Store A', 'time': 'Open 24 Hours', 'backgroundColor': '#B2EBF2', 'category': 'Grocery'},
        {'key': '22', 'title': 'Charlotte Grocery Store B', 'time': '6 AM - 11 PM EST', 'backgroundColor': '#B2EBF2', 'category': 'Grocery'},
        {'key': '23', 'title': 'Charlotte Grocery Store C', 'time': '7 AM - 10 PM EST', 'backgroundColor': '#B2EBF2'},
        {'key': '24', 'title': 'Charlotte Grocery Store D', 'time': '5 AM - Midnight EST', 'backgroundColor': '#B2EBF2'},
    ]

    # Retrieve events from the database
    events = db.Events.find()
    for event in events:
        event['_id'] = str(event['_id'])  # Convert ObjectId to string
        event['category'] = 'Event'
        data.append(event)

    return jsonify({'data': data}), 200

