# Step 1: Use the official Python image
FROM python:3.10-slim

# Step 2: Set the working directory
WORKDIR /app1

# Step 3: Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Step 4: Copy the Django application code
COPY . .

# Add these lines before CMD

ENV DJANGO_SUPERUSER_USERNAME=admin
ENV DJANGO_SUPERUSER_EMAIL=admin@example.com
ENV DJANGO_SUPERUSER_PASSWORD=adminpass

RUN python file_share_be/manage.py migrate
RUN python file_share_be/manage.py createsuperuser --noinput

# Step 5: Expose the port (Django default port)
EXPOSE 8000

# Step 6: Run the Django application
CMD ["python", "file_share_be/manage.py", "runserver", "0.0.0.0:8000"]
