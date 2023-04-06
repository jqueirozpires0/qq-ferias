from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

app = FastAPI()

origins = ["http://localhost:8080"]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Email(BaseModel):
    to_email: str
    assunto: str
    mensagem: str

class Workchat(BaseModel):
    nome: str

@app.get("/")
def ola():
    return {"Mensagem":"Olá, API"}

@app.post("/workchat")
async def mensagem_workchat(workchat: Workchat):
    try:
        url = "https://graph.facebook.com/v4.0/me/messages"
        token="DQVJzbi1raTJheGV6Ump4NE5RYUVUTTZAwNGx5dmdJOE00VTRDUHR6RjVxdTdYOHYtaTcxQW9pVHBhOVhiTW9BQkdrU3A3dUdpOU1EQ0ZAfeU1HaHloSGZAuVGFNQkctSlhMVjJHUHZAMcU82OG90dG5heE9uLW9YSTlOdExBWU8zVnNybm5vMU5kMEFoalBDRUZAvNlkyVG5PSlhqWTEtaWZAyazJ3di0yTTJ1aEdmTG5JMTRTd0tUWFlpb3ctSWFDNndpUWh3OXdn"
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        data = {
            "messaging_type": "UPDATE",
            "recipient": {
            "id": 100089568551133
            },
            "message": {
                "text": f"Colaborador {workchat.nome} realizou uma solicitação de férias, uma notificação foi gerada no QQ-Férias para sua análise"
            }
        }
        r = requests.post(url, headers=headers, json=data)
        print(r.status_code)
        print(r.text)
    except:
        print("Mensagem não enviada")


@app.post("/email")
async def enviar_email(email: Email):
    print(email.assunto)
    try:
        smpt_server = '10.0.0.241'
        smpt_port = 25
        smpt_username = 'qqtech-alunos@quero-quero.com.br'
        server = smtplib.SMTP(smpt_server, smpt_port)
        server.ehlo()

        print(email)
        assunto = email.assunto
        mensagem = email.mensagem
        to_email = email.to_email
        from_email = smpt_username
        message = f"Subject:{assunto}\n\n{mensagem}".encode('utf-8')

        server.sendmail(from_email, to_email, message)
        server.quit()

    except Exception as e:
        print("Error no envio do email", type(e).__name__)
