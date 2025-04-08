# from app import create_app

# app = create_app()

# if __name__ == '__main__':
#     app.run(debug=True)


from app import create_app
# from app.payments.stripe_webhooks import webhook_bp  

# Create main app
app = create_app()

# Register Webhook Blueprint
# app.register_blueprint(webhook_bp) 

if __name__ == "__main__":
    app.run(debug=True, port=5000) 

