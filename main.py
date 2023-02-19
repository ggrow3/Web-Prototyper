from flask import Flask, jsonify, render_template, request
import openai
import os

app = Flask(__name__)

openai.api_key = os.environ['OPENAI_TOKEN']


@app.route('/')
def index():
  return render_template('index.html')

@app.route('/post')
def post():
  return render_template('post.html')


@app.route('/gpt3_request', methods=['POST'])
def gpt3_request():
  data = request.get_json()
  prompt = data['prompt']
  completions = openai.Completion.create(
    engine="text-davinci-002",
    prompt=prompt,
    max_tokens=4000,
    n=1,
    stop=None,
    temperature=0.5,
  )

  message = completions.choices[0].text
  print(message)

  return jsonify({'message': message})


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=81)
