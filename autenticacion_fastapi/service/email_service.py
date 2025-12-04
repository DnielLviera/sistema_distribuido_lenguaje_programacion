import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config_entorno import settings

SMTP_EMAIL = settings.SMTP_EMAIL
SMTP_PASSWORD = settings.APP_PASSWORD
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

def send_verification_email(to_email: str, code: str):
    print("TO_EMAIL RECIBIDO EN EL SERVICIO:", to_email)
    msg = MIMEMultipart()
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg["Subject"] = "Código de verificación"

    body = f"Tu código de verificación es: {code}"
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print("Error enviando correo:", e)
        raise e
