from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
import csv
from typing import List
from fastapi.responses import StreamingResponse
import smtplib
import requests
import pandas as pd
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

#cd python
#python -m uvicorn main:app --reload

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

class Relatorio(BaseModel):
    colaborador: List[str]
    status: List[str]
    diasDisponiveis: List[int]

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
                #100081114973496
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

        assunto = email.assunto
        mensagem = email.mensagem
        to_email = email.to_email
        from_email = smpt_username
        message = f"Subject:{assunto}\n\n{mensagem}".encode('utf-8')

        server.sendmail(from_email, to_email, message)
        server.quit()

    except Exception as e:
        print("Error no envio do email", type(e).__name__)


@app.post("/relatorio")
async def gerar_relatorio(relatorio: Relatorio):
    print(relatorio)
    try:
        info = {"Colaborador": relatorio.colaborador, "Status": relatorio.status, "Dias para férias": relatorio.diasDisponiveis}

        # Abre o arquivo CSV para escrita
        with open('relatorio.csv', mode='w', newline='') as arquivo_csv:
            # Cria o escritor CSV
            escritor_csv = csv.writer(arquivo_csv)

            # Escreve os cabeçalhos das colunas
            escritor_csv.writerow(["Colaborador", "Status", "Dias para férias"])

            # Escreve os dados no arquivo CSV
            for i in range(len(relatorio.colaborador)):
                escritor_csv.writerow([relatorio.colaborador[i], relatorio.status[i], relatorio.diasDisponiveis[i]])

        with open('relatorio.csv', mode='r') as arquivo_csv:
            # Lê o conteúdo do arquivo CSV
            conteudo_csv = arquivo_csv.read()

        headers = {
            "Content-Disposition": "attachment; filename=relatorio.csv",
        }

        # Retorna o conteúdo do arquivo CSV como resposta HTTP
        return Response(content=conteudo_csv, media_type='text/csv', headers=headers)
                

    except Exception as e:
        print("Error no envio do email", type(e).__name__)