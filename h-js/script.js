(function(){

	var images = [];
	
	//imagem a ser exibida em caso de acerto
	var matchSign = document.querySelector("#match");
	
	//imagem de fim do jogo
	var modal = document.querySelector("#gameOver");
	
	//array que armazena as cartas viradas
	var flippedCards = [];
	
	//variável contadora de acertos. ao chegar em 8 o jogo termina
	var matches = 0;
		
	//variável contadora de cliques em cards
	var countCards = 0;

	//array de scores e a variável contadora de tempo
	var tempoTotal = 0;
	

	//estrutura de atribiução das imagens aos card
	for(var i = 0; i < 32; i++){
		//cria um objeto img com um src e um id
		var img = {
			src: "h-img/" + i + ".jpeg",
			id: i%16
		};
		
		//inserer o objeto criado no array
		images.push(img);
	}

// Função para exibir pontos e tempo decorrido.
	
/*	showPoints(){

		tempoTotal = cron;
		pontosTotal = matches;
}
*/


//TIMER
	"use strict"

	var mm = 0;
	var ss = 0;

	//Quantos milésemos equivalem a 1 seg
	var tempo = 1000; 
	var cron;

	function start(){

		cron = setInterval(() => { timer(); }, tempo);}

	function pause(){
		clearInterval(cron);
	}

	function stop(){
		clearInterval(cron);
		mm = 0;
		ss = 0;

		document.getElementById('counter').innerText = '00:00';

	}

	function timer(){

		ss++; //Incrementa +1 na variável ss

		if (ss == 59) { //Verifica se deu 59 segundos
			ss = 0; //Volta os segundos para 0
			mm++; //Adiciona +1 na variável mm
		}

		//Cria uma variável com o valor tratado HH:MM:SS
		var format = (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss);
		
		//Insere o valor tratado no elemento counter
		document.getElementById('counter').innerText = format;

		//Retorna o valor tratado
		return format;
	}
//ENDTIMER

	function showPoints(){

		tempoTotal.push(countCards);
		duracaoTotal.push(ss);
	}

	//Chama a função de inicialização do jogo
	startGame();
	
	//Função de inicialização do jogo
	function startGame(){

		flippedCards = [];
		
		//zera o contador de acertos
		matches = 0;

		start();
		
		//embaralhamento do array de imagens
		images = randomSort(images);
		
		//lista de elementos div com as classes back e front
		var backFaces = document.getElementsByClassName("back");
		var frontFaces = document.getElementsByClassName("front");
		
		//Define o posicionamento das cartas
		for(var i = 0; i < 16; i++){

			//limpa as cartas marcadas
			backFaces[i].classList.remove("match","flipped");
			frontFaces[i].classList.remove("match","flipped");
			
			//querySelector funcionaria mais rápido do que o GetElementById
			var card = document.querySelector("#card" + i);
			card.style.left = i % 8 == 0 ? 5 + "px" : i % 8 * 155 + 5 + "px";
			card.style.top = i < 8 ? 5 + "px" : 250 + "px";

			card.addEventListener("click",flipCard,false);

			frontFaces[i].style.background = "url('"+ images[i].src +"')";
			frontFaces[i].setAttribute("id", images[i].id);

		}
			//Pra testes,
			//console.log(card);
			/*No original, as cartas de id 0 e 8 recebiam os 5px de distância
			da margem à esquerda, aqui, precisamos da 0, 8, 16 e 32.
			Seguindo a mesma lógica, a divisão de 16/8 e de 32/8 também darão resto 0 */
			
			for(var i = 16; i < 32; i++){
				frontFaces[i].classList.remove("match","flipped");
				backFaces[i].classList.remove("match","flipped");
				
				var card = document.querySelector("#card" + i);
				card.style.left = (i == 16 || i == 24) ? 5 + "px" : i % 8 * 155 + 5 + "px";
				card.style.top = i < 24 ? 495 + "px" : 740 + "px";

				//adiciona às cartas o evento click chamando a função que vira as cartas
				card.addEventListener("click",flipCard,false);

				//adiciona as imagens às cartas
				frontFaces[i].style.background = "url('"+ images[i].src +"')";
				frontFaces[i].setAttribute("id", images[i].id);					
		}
		
		//joga a imagem de game over para o plano de fundo
		modal.style.zIndex = "-2";
		
		//remove o evento click da imagem de game over
		modal.removeEventListener('click',function(){
			startGame();
		},false);
	}//fim da função de inicialização do jogo

	//função que vira as cartas
	function flipCard(){
		//verifica se o número de cartas viradas é menor que 2
		if(flippedCards.length < 2){
			//pega as faces da carta clicada
			var faces = this.getElementsByClassName("face");
			
			//confere se a carta já está virada, impedindo que a mesma carta seja virada duas vezes
			if(faces[0].classList[2]){
				return;
			}
			
			//adiciona a classe fliped às faces da carta para que sejam viradas
			faces[0].classList.toggle("flipped");
			faces[1].classList.toggle("flipped");
			countCards++;

			//adiciona a carta clicada ao array de cartas viradas
			flippedCards.push(this);
			
			//verifica se o número de cartas no array de cartas viradas é igual a 2
			if(flippedCards.length === 2){
				//compara o id das cartas viradas para ver se houve um acerto
				if(flippedCards[0].childNodes[3].id === flippedCards[1].childNodes[3].id){
					//em caso de acerto adiciona a classe match a todas as faces das duas cartas presentes no array de cartas viradas
					flippedCards[0].childNodes[1].classList.toggle("match");
					flippedCards[0].childNodes[3].classList.toggle("match");
					flippedCards[1].childNodes[1].classList.toggle("match");
					flippedCards[1].childNodes[3].classList.toggle("match");
					
					//chama a função que exibe a mensagem MATCH
					matchCardsSign();
					
					//limpa o array de cartas viradas
					flippedCards = [];
					
					//soma um ao contador de acertos
					matches++;
					
					//verifica se o contador de acertos chegou a 16
					if(matches >= 16){
					//caso haja 16 acertos ou mais, chama a função que finaliza o jogo

						gameOver();
						
					}
				} 
			} 
		} else {
			//em caso haver duas cartas no array de cartas viradas (terceiro click) remove a classe flipped das cartas no array de cartas viradas
			flippedCards[0].childNodes[1].classList.toggle("flipped");
			flippedCards[0].childNodes[3].classList.toggle("flipped");
			flippedCards[1].childNodes[1].classList.toggle("flipped");
			flippedCards[1].childNodes[3].classList.toggle("flipped");
			
			//limpa o array de cartas viradas
			flippedCards = [];
		}
	}
	
	
	//função que embaralha as cartas recebendo um array de cartas por parâmetro
	function randomSort(array){
		//cria um array vazio
		var newArray = [];
		
		//executa a estrutura enquanto o novo array não atingir o mesmo número de elementos do arrau passado por parâmetro
		while(newArray.length !== array.length){
			//cria uma variável i recebendo um número aleatório entre 0 e o número de elementos no array -1
			var i = Math.floor(Math.random()*array.length);
			
			//verifica se o elemento indicado pelo índice i já existe no array novo
			if(newArray.indexOf(array[i]) < 0){
				//caso não exista é inserido
				newArray.push(array[i]);
			}
		}
		
		//retorna o array novo, que possui os elementos do array passado por parâmetro embaralhados
		return newArray;
	}//fim da função que embaralha as cartas
	
	
	//função que gera o sinal de MATCH
	function matchCardsSign(){
		//joga a mensagem de MATCH para o primeiro plano
		matchSign.style.zIndex = "1";
		
		//deixa a mensagem transparente
		matchSign.style.opacity = "0";
		
		//move a mensagem para cima
		matchSign.style.top = "150px";
		
		//função executada após 1.5 segundo
		setTimeout(function(){
			//joga a mensagem de MATCH para o plano de fundo
			matchSign.style.zIndex = "-1";
			
			//remove a transparência da mansagem
			matchSign.style.opacity = "1";
			
			//move a mensagem para o centro da tela
			matchSign.style.top = "250px";
		},1500);
	}//fim da função que exibe mensagem de MATCH
	
	//função de fim do jogo
	function gameOver(){
		//joga a mensagem de fim do jogo para o plano da frente
		modal.style.zIndex = "99";
		pause();

		//retorna a quantidade de vezes que virou a carta e o tempo que levou
		//console.log(countCards);
		//console.log(tempoTotal);
		document.getElementById("pontos").innerHTML = countCards;
		document.getElementById("duracao-min").innerHTML = mm += "minutos";
		document.getElementById("duracao").innerHTML = ss += "segundos";
		
		//chama a função stop do timer
		stop();


		//adiciona o evento click à imagem de game over
		modal.addEventListener('click',function(){

			showPoints();
		//chama a função que reinicia o jogo
		//Recomeçar o jogo de imediato
		//startGame();
		},false);
	}
}());