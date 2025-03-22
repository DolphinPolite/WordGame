from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import time
import random
import enchant
import requests
import urllib.parse

app = Flask(__name__)
app.secret_key = "your_secret_key"

word_list = ["elma", "muz", "turuncu", "karakalem", "meslek", "eskici", "niye", "abdülrezzak", "bomba", "ekmekspor"]

def is_real_word(word):
    try:
        # URL encoding uygula
        encoded_word = urllib.parse.quote(word)
        print("Encoded Word:", encoded_word)
        response = requests.get(f"https://sozluk.gov.tr/gts?ara={encoded_word}", timeout=2)
        data = response.json()
        
        # API yanıtını kontrol et
        if isinstance(data, list):
            # Eğer liste boşsa veya hata içeriyorsa
            if len(data) == 0 or "error" in data[0]:
                return False
            # Eğer "anlamlarListe" içeriyorsa, geçerli bir kelimedir
            if "anlamlarListe" in data[0]:
                return True
        return False
    except:
        # API çağrısı başarısız olursa, kelimeyi geçerli kabul et
        return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game', methods=['GET', 'POST'])
def game():
    if request.method == 'POST':

        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        print(f"Is AJAX request: {is_ajax}")
        
        word = request.form.get('word', '').strip().lower()
        time_left = float(request.form.get('time_left', 0))
        game_over = request.form.get('game_over') == 'true'
        
        print(f"Word: {word}, Time left from client: {time_left}")
        
        if game_over or time_left <= 0:
            if is_ajax:
                return jsonify({'game_over': True})
            else:
                return redirect(url_for('game_over'))
            
        current_word = session.get('current_word', random.choice(word_list))
        
        if 'start_time' not in session:
            session['start_time'] = time.time()

        elapsed_time = time.time() - session.get('start_time', time.time())
        print(f"Elapsed time: {elapsed_time} seconds")
        
        time_left = float(request.form.get('time_left', 0))
        session['time_left'] = time_left
        print(f"Time left from session before calculation: {session['time_left']}")
        
        points, error_type = calculate_points(word, current_word, elapsed_time)
        session['score'] = session.get('score', 0) + points
        
        print(f"Points: {points}, New score: {session['score']}")
        print(f"Time left after calculation: {session['time_left']}")
        
        session['start_time'] = time.time()
        
        if points > 0:
            session['current_word'] = word
            # Kullanılmış kelimeleri güncelle
            if 'used_words' not in session:
                session['used_words'] = []
            if word not in session['used_words']:
                session['used_words'] = session['used_words'] + [word]
        else:
            session['current_word'] = current_word
        
        session['time_left'] = max(0, session['time_left'])
        
        if is_ajax:
            response_data = {
                'time_left': session['time_left'],
                'score': session['score'],
                'current_word': session['current_word'],
                'used_words': session.get('used_words', []),
                'game_over': False,
                'error': error_type if points < 0 else None  # Hata varsa hata türünü gönder
            }
            return jsonify(response_data)
        else:
            return render_template('game.html', 
                                  time=session['time_left'], 
                                  score=session['score'], 
                                  current_word=session['current_word'])

    
    elif request.method == 'GET':
        player_name = request.args.get('player_name', 'Player')
        session['player_name'] = player_name
        session['time_left'] = 30.0
        session['score'] = 0
        session['used_words'] = []
        session['current_word'] = random.choice(word_list)
        session['start_time'] = time.time()
        
        return render_template('game.html', 
                              time=session['time_left'], 
                              score=session['score'], 
                              current_word=session['current_word']
                            )

def calculate_points(word, current_word, elapsed_time):
    if not word:
        return 0
    
    if not word.startswith(current_word[-1]):
        session['time_left'] = max(0, session['time_left'] - 5)
        return -1, "wrong_letter"
    
    if word in session.get('used_words', []):
        session['time_left'] = max(0, session['time_left'] - 7)
        return -1, "used_word" 
    
    if not word.isalpha():
        session['time_left'] = max(0, session['time_left'] - 9)
        return -3, "invalid_char" 
    
    if not is_real_word(word):
        session['time_left'] = max(0, session['time_left'] - 8)
        return -2, "not_a_word"  
    
    points = 0
    if elapsed_time <= 5:
        points += 4  
    elif elapsed_time <= 10:
        points += 3  
    elif elapsed_time <= 15:
        points += 2  
    else:
        points += 1 
    
    session['time_left'] += points * 1
    
    return points, ""

@app.route('/game_over')
def game_over():
    return render_template('game_over.html', score=session.get('score', 0))

if __name__ == '__main__':
    app.run(debug=True)
