# Door-RFID
用 Python RFID 一下

## Version
Python 3

## Instructions

```script=
# 1. Setup Virtual Environment
$ virtualenv -p python3 env

# 2. Activate Virtual Environment
$ source env/bin/activate

# 3. Install Project Packages
$ pip install -r requirements.txt

# 4. Start
$ python index.py

# 5. Deactitvate
$ deactivate
```
## Note

- pip save packages
```
$ pip freeze > requirements.txt
```
- Run with PM2
```
$ sudo pm2 start index.py --interpreter=python3
```
