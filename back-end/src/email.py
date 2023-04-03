import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

host = '10.0.0.241'
port = 25
email_de = "qqtech-alunos@quero-quero.com.br"
email_para = ['jqueirozpires@gmail.com']

email_body = 'Olá!! <br>Isso é um <b>teste</b>'

msg = MIMEText(email_body, 'html')

msg['Subject'] = "Teste QQ"
msg['From'] = email_de
msg['To'] = ', '.join(email_para)

s = smtplib.SMTP(host, port)
s.ehlo()
s.send(email_de, email_para, msg.as_string())
s.quit()