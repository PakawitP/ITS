FROM python:3.8.7
 

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /its_backend
 
COPY ./ITSbackend/requirements.txt /its_backend
RUN pip install -r requirements.txt
 
COPY ./ITSbackend /its_backend
 
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


# FROM python:3.8.7
 

# RUN apt-get update \
#     && apt-get install -y --no-install-recommends \
#         postgresql-client \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /app/api
 
# COPY ./ITSbackend/requirements.txt .
# RUN pip install -r requirements.txt
 
# COPY ./ITSbackend ./
 
# EXPOSE 8000

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]