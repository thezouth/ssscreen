from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import csv
import io
import re

app = Flask(__name__)
cors = CORS(app)

SETTRADE_URL = 'http://www.settrade.com'

@app.route('/intraday/<symbol>')
def intraday(symbol):
    resp = requests.get(f'{SETTRADE_URL}/servlet/IntradayStockChartDataServlet?symbol={symbol}',
        headers={'referer': f'{SETTRADE_URL}'})
    resp_data = list(csv.reader(io.StringIO(resp.text), delimiter=','))
    quote, header, *data = resp_data

    return jsonify({
        'quote': quote,
        'data': [ dict(zip(header, row)) for row in data ]
        })

@app.route('/historical/<symbol>')
def historical(symbol):
    count = request.args.get('count')
    resp = requests.get(f'{SETTRADE_URL}/corp/ipo/technical/chart.jsp?symbolType=s&period={count}&mkt=A&stockName={symbol}&indexName=undefined&rdoChartType=1&cboTech1=RSI&cboTech2=None&chkMovAvg0=0&chkMovAvg1=0&chkMovAvg2=0',
        headers={'referer': f'{SETTRADE_URL}'})
    data = resp.text

    sample_date = re.search('sampleList = "(.+)";', data)[1].split(',')
    high_price = re.search('detailList_0 = "(.+)";', data)[1].split(',')
    low_price = re.search('detailList_1 = "(.+)";', data)[1].split(',')
    open_price = re.search('detailList_2 = "(.+)";', data)[1].split(',')
    close_price = re.search('detailList_3 = "(.+)";', data)[1].split(',')
    volume = list(map(int, re.search('volumeList = "(.+)";', data)[1].split(',')))

    return jsonify({
        'data': {
            'sample_date': sample_date,
            'open': open_price,
            'low': low_price,
            'high': high_price,
            'close': close_price,
            'volume': volume
        }
    })

@app.route('/status')
def status():
    return 'ok'

if __name__ == '__main__':
    app.run()
