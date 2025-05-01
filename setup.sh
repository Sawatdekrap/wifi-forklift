apt update
apt full-upgrade -y
# Install picamera2 outside of venv, and use through system site packages to avoid compatibility issues
apt install -y python3-picamera2 --no-install-recommends
python -m venv --system-site-packages venv
source venv/bin/activate
pip install websockets Pillow gpiozero
