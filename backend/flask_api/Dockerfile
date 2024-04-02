# Use the official lightweight Python image.
FROM python:3.9-slim

RUN apt-get update \
    && apt-get install -y gcc libmariadb-dev-compat libmariadb-dev pkg-config \
    && apt-get clean

# Set the working directory in the container to /app.
WORKDIR /app

# Copy the current directory contents into the container at /app.
COPY . /app

# Install the Python dependencies.
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container.
EXPOSE 8000

# Define environment variable

# Run app.py when the container launches.
CMD ["python", "main.py"]