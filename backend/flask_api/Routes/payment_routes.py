from stripe.api_resources import customer
from Routes.auth_routes import token_required
from __main__ import app
from flask import json, request, jsonify
import stripe
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.

# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
stripe.api_key = 'sk_test_51OfniJDtK57hwiI4d30WFmGCSgyTkdiTJqQuA8Pt3CMvYkuMkpEpAhQZfgUYklhdGh17QsDUZvlhjMaXTteDnhTD00TYhwPgyT'

# @app.route('/payment-sheet', methods=['POST'])
# def payment_sheet():
#   # Use an existing Customer ID if this is a returning customer
#   customer = stripe.Customer.create()
#   ephemeralKey = stripe.EphemeralKey.create(
#     customer='cus_Pq9XoQBKPwyDUc',
#     stripe_version='2023-10-16',
#   )
#   paymentIntent = stripe.PaymentIntent.create(
#     amount=1099,
#     currency='eur',
#     customer='cus_Pq9o1YSItMduQi',
#     # In the latest version of the API, specifying the `automatic_payment_methods` parameter
#     # is optional because Stripe enables its functionality by default.
#     automatic_payment_methods={
#       'enabled': True,
#     },
#   )
#   return jsonify(paymentIntent=paymentIntent.client_secret,
#                  ephemeralKey=ephemeralKey.secret,
#                  customer=customer.id,
#                  publishableKey='pk_test_51OfniJDtK57hwiI4CY9u4qzBlNrMLx4n86CmF7hSvmcDFwRJje8noHmnWaw8ESybJHZAXWQPvCBdq0Auu8Ey8lbP00fLL5NXkH')
# This example sets up an endpoint using the Flask framework.
# Watch this video to get started: https://youtu.be/7Ul1vfmsDck.


@app.route('/payment-sheet', methods=['POST','GET'])
def payment_sheet():
  # Use an existing Customer ID if this is a returning customer
  customers = stripe.Customer.list()
  customer = customers.data[0]
  print('CUSTOMER ID:' , customer.id)
  print(customers)

  ephemeralKey = stripe.EphemeralKey.create(
    customer=customer.id,
    stripe_version='2023-10-16',
  )
  paymentIntent = stripe.PaymentIntent.create(
    amount=1099,
    currency='eur',
    customer=customer.id,
    payment_method_types=["card"],
  )
  return jsonify(paymentIntent=paymentIntent.client_secret,
                 ephemeralKey=ephemeralKey.secret,
                 customer=customer.id,
                 publishableKey='pk_test_51OfniJDtK57hwiI4CY9u4qzBlNrMLx4n86CmF7hSvmcDFwRJje8noHmnWaw8ESybJHZAXWQPvCBdq0Auu8Ey8lbP00fLL5NXkH')