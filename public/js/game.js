'use strict';

$(function () {
	var canvas = $('.asmtfy').get(0);
	var ctx = canvas.getContext('2d');
	$(window).on('resize', function () {
		$(canvas).each(function () {
			$(this).css('height', $(this).width() * (45 / 100) + 'px');
			if ($(window).width() * (45 / 100) < $(window).height()) {
				$(this).width($(window).width()).height($(window).width() * (45 / 100));
			} else {
				$(this).width($(window).height() * (100 / 45)).height($(window).height());
			}
			this.width = $(this).width();
			this.height = $(this).height();
		});
	}).resize();

	var game = new function () {
		var socket = io();

		var arena;
		socket.on('arena', function (molde) {
			arena = new function Arena() {
				var layers = [];
				for (var i = 0; i < molde.layers; i++) {
					layers[i] = $('<img>', {
						'src': '/assets/arenas/' + molde.name + '/' + i + '.png'
					}).get(0);
				}

				var ground = $('<img>', {
					'src': '/assets/arenas/' + molde.name + '/ground.png'
				}).get(0);

				var wind = {
					fx: molde.fx,
					fy: molde.fy,
					prob: molde.prob,
					amax: molde.amax,
					amin: molde.amin
				};

				var update = function update() {
					return true;
				};

				var draw = function draw() {
					layers.concat(ground).map(function (layer) {
						ctx.drawImage(layer, 0, -(canvas.width / layer.width * layer.height - canvas.height), canvas.width, canvas.width / layer.width * layer.height);
					});
				};

				var load = function load() {
					var load = true;
					layers.concat(ground).forEach(function (layer) {
						if (!layer.width) load = false;
					});
					return load;
				};

				this.update = function () {
					update();
				};

				this.draw = function () {
					draw();
				};

				this.load = function () {
					return load();
				};
			}();
		});

		var state;
		this.state = function (estado) {
			if (estado) {
				state.end();
				estado.start();
				return state = estado;
			} else {
				return state;
			}
		};

		state = new function Load() {
			var start = function start() {
				$('html').attr('lang', localStorage.getItem('lang'));

				$('body').append($('<p>', {
					'class': 'waiting'
				}).append($('<span>', {
					'lang': 'pt-br'
				}).append('Esperando oponente'), $('<span>', {
					'lang': 'en'
				}).append('Waiting opponent'), $('<span>').each(function () {
					var tick = 0;
					var span = this;
					window.setInterval(function () {
						$(span).text('.'.repeat(++tick % 3 + 1));
					}, 1000);
				})).each(function () {
					var span = this;
					$(window).resize(function () {
						$(span).css({
							'top': $(canvas).offset().top + $(canvas).height() * 0.75 + 'px'
						});
					}).resize();
				}), $('<p>', {
					'class': 'loading'
				}).append($('<span>', {
					'lang': 'pt-br'
				}).append('Carregando'), $('<span>', {
					'lang': 'en'
				}).append('Loading'), $('<span>').each(function () {
					var tick = 0;
					var span = this;
					window.setInterval(function () {
						$(span).text('.'.repeat(++tick % 3 + 1));
					}, 1000);
				})).each(function () {
					var span = this;
					$(window).resize(function () {
						$(span).css({
							'top': $(canvas).offset().top + $(canvas).height() * 0.85 + 'px'
						});
					}).resize();
				}), $('<img>', {
					'class': 'arena',
					'src': '/assets/arenas/' + Cookies.get('arena') + '/' + Cookies.get('arena') + '.jpg'
				}).each(function () {
					var img = this;
					$(window).resize(function () {
						$(img).css({
							'width': $(canvas).width() * 0.4 + 'px',
							'top': $(canvas).offset().top + $(canvas).height() * 0.1 + 'px'
						});
					}).resize();
				}));
			};
			var end = function end() {
				$('.loading, .waiting, .arena').remove();
			};
			var update = function update() {
				if (arena && arena.load()) game.state(new function Partida() {
					var update = function update() {
						arena.update();
					};
					var draw = function draw() {
						arena.draw();
					};
					var start = function start() {
						var red_points;
						$('body').append(red_points = $('<p>', {
							'class': 'red_points'
						}).append('0000').each(function () {
							var points = this;
							$(window).resize(function () {
								$(points).css({
									'top': $(canvas).offset().top + $(canvas).height() * 0.025 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.025 + 'px'
								});
							}).resize();
						}).get(0));

						var red_points_bar;
						$('body').append(red_points_bar = $('<div>', {
							'class': 'red_points_bar'
						}).each(function () {
							var bar_frame = this;
							$(window).resize(function () {
								$(bar_frame).css({
									'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
									'left': $(red_points).offset().left + $(red_points).outerWidth() * 1.15 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() * 0.5 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'red_inner_score_bar'
						})));

						$('body').append($('<div>', {
							'class': 'red_team'
						}).append($('<img>', {
							src: '/img/mini_portrait_red.png'
						})).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(red_points).outerWidth() * 0.9 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() + 'px',
									'left': $(red_points).offset().left + $(red_points).width() * 0.1 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'red_team_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('time azul'), $('<span>', {
							'lang': 'en'
						}).append('blue team')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'left': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top + $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'red_points_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('pontos'), $('<span>', {
							'lang': 'en'
						}).append('score')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'left': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top - $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						var yellow_points;
						$('body').append(yellow_points = $('<p>', {
							'class': 'yellow_points'
						}).append('0000').each(function () {
							var points = this;
							$(window).resize(function () {
								$(points).css({
									'top': $(canvas).offset().top + $(canvas).height() * 0.025 + 'px',
									'right': $(canvas).offset().left + $(canvas).width() * 0.025 + 'px'
								});
							}).resize();
						}).get(0));

						var yellow_points_bar;
						$('body').append(yellow_points_bar = $('<div>', {
							'class': 'yellow_points_bar'
						}).each(function () {
							var bar_frame = this;
							$(window).resize(function () {
								$(bar_frame).css({
									'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
									'right': $(red_points).offset().left + $(red_points).outerWidth() * 1.15 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() * 0.5 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'yellow_inner_score_bar'
						})));

						$('body').append($('<div>', {
							'class': 'yellow_team'
						}).append($('<img>', {
							src: '/img/mini_portrait_yellow.png'
						})).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(red_points).outerWidth() * 0.9 + 'px',
									'top': $(red_points).offset().top + $(red_points).outerHeight() + 'px',
									'right': $(red_points).offset().left + $(red_points).width() * 0.1 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'yellow_team_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('time vermelho'), $('<span>', {
							'lang': 'en'
						}).append('red team')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'right': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top + $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<p>', {
							'class': 'yellow_points_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('pontos'), $('<span>', {
							'lang': 'en'
						}).append('score')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'right': $(red_points_bar).offset().left - 30 + 'px',
									'top': $(red_points_bar).offset().top - $(red_points_bar).outerHeight() + 5 + 'px'
								});
							}).resize();
						}));

						var char_portrait;
						$('body').append(char_portrait = $('<img>', {
							'src': '/assets/chars/' + Cookies.get('char') + '/skills/portrait.png',
							'class': 'char_portrait'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.06 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.125 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.0125 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<img>', {
							'src': '/assets/chars/' + Cookies.get('char') + '/skills/0.png',
							'class': 'char_skill_1'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.02 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.017 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<img>', {
							'src': '/assets/chars/' + Cookies.get('char') + '/skills/1.png',
							'class': 'char_skill_2'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'width': $(canvas).width() * 0.02 + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.05 + 'px'
								});
							}).resize();
						}));

						$('body').append($('<div>', {
							'class': 'power_bar'
						}).each(function () {
							var portrait = this;
							$(window).resize(function () {
								$(portrait).css({
									'height': $(canvas).height() * 0.045 + 'px',
									'width': $(canvas).width() * 0.35 - $(red_points).outerWidth() + 'px',
									'bottom': $(canvas).offset().top + $(canvas).height() * 0.060 + 'px',
									'left': $(canvas).offset().left + $(canvas).width() * 0.085 + 'px'
								});
							}).resize();
						}).append($('<div>', {
							'class': 'inner_power_bar'
						})));

						$('body').append($('<p>', {
							'class': 'power_bar_label'
						}).append($('<span>', {
							'lang': 'pt-br'
						}).append('barra de força'), $('<span>', {
							'lang': 'en'
						}).append('power bar')).each(function () {
							var time = this;
							$(window).resize(function () {
								$(time).css({
									'top': $(char_portrait).offset().top + $(char_portrait).height() - 10 + 'px',
									'left': $(char_portrait).offset().left + $(char_portrait).width() + 10 + 'px'
								});
							}).resize();
						}));
					};
					var end = function end() {
						return true;
					};

					this.update = function () {
						update();
					};
					this.draw = function () {
						draw();
					};
					this.start = function () {
						start();
					};
					this.end = function () {
						end();
					};
				}());
			};
			var draw = function draw() {
				//				arena && console.log(arena.load());
			};
			this.start = function () {
				start();
			};
			this.update = function () {
				update();
			};
			this.draw = function () {
				draw();
			};
			this.end = function () {
				end();
			};
		}();
		state.start();
	}();

	var now;
	var delta;
	var before;
	window.requestAnimationFrame(function loop() {
		now = Date.now();
		delta = now - before;
		before = now;

		game.state().update();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.state().draw();

		window.requestAnimationFrame(loop);
	});
});

//$(function () {
//	'use strict';
//
//	const canvas = $('.asmtfy').get(0);
//	const ctx = canvas.getContext('2d');
//
//	var state = 'load';
//
//	var arena, me, him, winner = {
//		udpdate: function () {
//			return undefined
//		},
//		draw: function () {
//			return undefined
//		},
//		load: function () {
//			return undefined
//		}
//	}
//
//	const update = function () {
//		if (state === 'load') {
//			if (me.load() && him.load() && arena.load()) {
//				state === 'game';
//			}
//		}
//
//		if (state === 'game') {
//			arena.update();
//			him.update();
//			me.update();
//		}
//
//		if (state === 'end') {
//			winner.update();
//		}
//	}
//
//	const draw = function (){
//		if (state === 'load') {
//			if(!$('.loading').get(0)) {
//				let tick = 0;
//
//				$('body').append(
//					$('<p>', {
//						'class': 'loading'
//					}).append(
//						'Carregando',
//	
//						$('<span>')
//					)
//				);
//
//				window.setInterval(function () {
//					tick++;
//					$('.loading').children('span').text('.'.repeat(tick % 3 + 1));
//				}, 1000);
//
//				$(window).resize(function () {
//					$('.loading').css({
//						'position': 'absolute',
//						'bottom': $(canvas).offset().top() * 0.9 + 'px',
//						'left': '50%',
//						'transform': 'translate(-50%)'
//					});
//				}).resize();
//			}
//		} else {
//			$('.loading').remove();
//		}
//
//		if (state === 'game') {
//			arena.draw();
//			him.draw();
//			me.draw();
//		}
//
//		if (state = 'end') {
//			winner.draw();
//		}
//	}
//
//	var now;
//	var delta;
//	var before;
//
//	const Arena = function (arena) {
//		function Arena(molde) {
//			this.wind = {
//				min: molde.wind.min,
//				max: molde.wind.max,
//				prob: molde.wind.prob
//			};
//
//			this.ground = $('<img>', {
//				src: '/assets/arenas' + molde.assets + '/ground.png'
//			}).get(0);
//
//			this.layers = Array(molde.layers).map(function (value, index) {
//				return $('<img>', {
//					src: '/assets/arenas' + molde.assets + '/' + index + '.png'
//				}).get(0);
//			});
//
//			this.update = function () {
//				return undefined;
//			};
//
//			this.draw = function () {
//				this.layers.concat(this.ground).map(function (layer, index, array) {
//					ctx.drawImage(
//						layer,
//						0,
//						-(canvas.width / image.width * image.height - canvas.height),
//						canvas.width,
//						canvas.width / image.width * image.height
//					);
//				});
//			};
//
//			this.load = function () {
//				return this.layers.concat(this.ground).every(function (layer) {
//					return layer.complete;
//				});
//			};
//		}
//
//		switch (arena) {
//			case 'flat':
//				return new Arena ({
//					wind: {
//						min: 0,
//						max: 0,
//						prob: 0
//					},
//					assets: '/' + arena,
//					layers: 2
//				});
//				break;
//			case 'wall':
//				return new Arena ({
//					wind: {
//						min: 0,
//						max: 0,
//						prob: 0
//					},
//					assets: '/' + arena,
//					layers: 2
//				});
//				break;
//		}
//	}
//
//	const Char = function (char) {
//		function Char(molde) {
//			var action = 'idle';
//			var last = action
//			var keys = [];
//			var frame = 0;
//			var position = molde.position;
//
//			this.update = function () {
//				frame += delta;
//
//				switch (action) {
//					case 'idle':
//						if (!(last === action)) {
//							$(window).off('keydown', kd_running);
//							$(window).off('keydown', kd_jumping);
//							$(window).off('keydown', kd_upping);
//							$(window).off('keydown', kd_falling);
//							$(window).off('keydown', kd_charging);
//							$(window).off('keydown', kd_shooting);
//
//							$(window).off('keyup', ku_running);
//							$(window).off('keyup', ku_jumping);
//							$(window).off('keyup', ku_upping);
//							$(window).off('keyup', ku_falling);
//							$(window).off('keyup', ku_charging);
//							$(window).off('keyup', ku_shooting);
//
//							$(window).keydown(function kd_idle(event) {
//								keys.push(event.key);
//
//								if (event.key === 'd') {
//									action = 'running'
//								}
//								if (event.key === 'a') {
//									action = 'running'
//								}
//								if (event.key === 'w') {
//									action = 'jumping'
//								}
//								if (event.key === 'charging') {
//									action = 'running'
//								}
//							})
//
//							this.hit = function () {
//								action = 'hitting'
//							}
//
//							this.animation = {
//								draw: function () {
//									frame 
//								},
//								start: function () {
//									frame = 0;
//								},
//								end: function () {
//									this.start();
//								}
//							}
//
//							return last = action;
//						}
//						break;
//
//					case 'hitting':
//						if (!)
//				}
//				if (action === 'idle') {
//				}
//				if (action === 'running') {
//					
//				}
//				if (action === 'jumping') {
//					
//				}
//				if (action === 'upping') {
//					
//				}
//				if (action === 'falling') {
//					
//				}
//				if (action === 'charging') {
//					
//				}
//				if (action === 'shooting') {
//					
//				}
//				if (action === 'hitting') {
//					
//				}
//				last = action;
//			}
//		}
//
//		return new Char ({
//			name: char.name,
//			id: char.id,
//			assets: '/' + char.name,
//			position: char.position
//		})
//	}
//
//	const socket = io();
//	socket.on('arena', function (ring) {
//		arena = Arena(ring);
//	});
//	socket.on('me', function (i) {
//		me = Char(i);
//	});
//	socket.on('him', function (u) {
//		him = Char(u);
//	});
//
//	$(window).on('resize', function () {
//		$('.game').each(function () {
//			$(this).css('height', $(this).width() * (45/100) + 'px');
//			if ($(window).width() * (45/100) < $(window).height()) {
//				$(this).width($(window).width()).height($(window).width() * (45/100));
//			} else {
//				$(this).width($(window).height() * (100/45)).height($(window).height());
//			}
//			this.width = $(this).width();
//			this.height = $(this).height();
//		});
//	}).resize();
//
//	window.requestAnimationFrame(function loop() {
//		now = Date.now();
//		delta = now - before;
//		before = now;
//
//		update();
//		ctx.clearRect(0, 0, canvas.width, canvas.height);
//		draw();
//
//		window.requestAnimationFrame(loop);
//	});
//});
//
//
////$(function () {
////	$(window).on('resize', function () {
////		$('.game').each(function () {
////			$(this).css('height', $(this).width() * (45/100) + 'px');
////			if ($(window).width() * (45/100) < $(window).height()) {
////				$(this).width($(window).width()).height($(window).width() * (45/100));
////			} else if ($(window).width() * (45/100) > $(window).height()){
////				$(this).width($(window).height() * (100/45)).height($(window).height());
////			}
////			this.width = $(this).width();
////			this.height = $(this).height();
////		});
////	}).resize();
////
////	const socket = io();
////
////	(function () {
////		var before = Date.now(),
////			delta,
////			now,
////			estado;
////
////		const $canvas = $('.asmtfy'),
////			  canvas = $canvas.get(0),
////			  ctx = canvas.getContext('2d');
////
////		const inherit = function (child, parent) {
////			if (child instanceof Function && parent instanceof Function) {
////				parent = Object.create(parent.prototype);
////				parent.constructor = child;
////				child.prototype = parent;
////			}
////		};
////
////		const State = function (elements, atualize, desenhe, comece, termine, pausa, continua, pare) {
////			const update = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.update instanceof Function) element.update();
////					  });
////				  },
////				  draw = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.draw instanceof Function) element.draw();
////					  });
////				  },
////				  start = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.start instanceof Function) element.start();
////					  });
////				  },
////				  end = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.end instanceof Function) element.end();
////					  });
////				  },
////				  pause = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.pause instanceof Function) element.pause();
////					  });
////				  },
////				  play = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.play instanceof Function) element.play();
////					  });
////				  },
////				  stop = function () {
////					  if (elements instanceof Object) Object.values(elements).forEach(function (element) {
////						  if(element.stop instanceof Function) element.stop();
////					  });
////				  };
////			this.update = function (delta) {
////				if (atualize instanceof Function) atualize();
////				update();
////			};
////			this.draw = function (delta) {
////				if(desenhe instanceof Function) desenhe();
////				draw();
////			};
////			this.start = function () {
////				if(comece instanceof Function) comece();
////				start();
////			};
////			this.end = function () {
////				if(termine instanceof Function) termine();
////				end();
////			};
////			this.pause = function () {
////				if(pausa instanceof Function) pausa();
////				pause();
////			};
////			this.play = function () {
////				if(continua instanceof Function) continua();
////				play();
////			};
////			this.stop = function () {
////				if(pare instanceof Function) pare();
////				if(elements instanceof Object) Object.values(elements).forEach(function (element) {
////					if(element.stop instanceof Function) element.stop();
////				});
////				stop();
////			};
////		};
////
////		const Loading = function () {
////			var arena;
////
////			const elements = {},
////				  comece = function () {
////					  const Arena = function (layers, ground, g, wind, atualize, desenhe, comece, termine, pausa, continua, pare, carregado) {
////						  const loaded = function () {
////									var flag = true;
////									if (carregado instanceof Function) {
////										if (!carregado()) flag = false;
////									}
////									if (layers instanceof Array) {
////										if (!(layers.every(function (layer) {
////											if (layer instanceof Layer) {
////												return layer.loadead();
////											} else {
////												return true;
////											}
////										}))) flag = false;
////									}
////									if (!(ground.load())) flag = false;
////									return flag;
////								},
////								image = function () {
////									const aux_canvas = $('<canvas>').get(0),
////										  aux_ctx = aux_canvas.getContext('2d');
////									aux_canvas.width = ground.image().width;
////									aux_canvas.height = ground.image().height;
////									if (layers instanceof Array) layers.forEach(function (layer) {
////										if (layer instanceof Layer) aux_ctx.drawImage(layer.image(), 0, 0);
////									});
////									aux_ctx.drawImage(ground.image(), 0, 0);
////									return $('<img>', {
////										'src': aux_canvas.toDataURL()
////									}).get(0);
////								},
////								update = function () {
////									if (layers instanceof Array) layers.forEach(function (layer) {
////										if (layer instanceof Layer) layer.update();
////									});
////								},
////								draw = function () {
////									if (layers instanceof Array) layers.forEach(function (layer) {
////										if (layer instanceof Layer) layer.draw();
////									});
////									if (ground instanceof Ground) ground.draw()
////								};
////						  
////						  this.wind = function (vento) {
////							  if (wind instanceof Object) {
////								  if (vento instanceof Object) {
////									  if($.isNumeric(vento.x)) wind.x = vento.x;
////									  if($.isNumeric(vento.y)) wind.y = vento.y;
////								  } else {
////									  return $.extend({}, wind);
////								  }
////							  }
////						  };
////						  this.g = function (gravity) {
////							  if ($.isNumeric(gravity)) {
////								  g = gravity;
////							  } else {
////								  return g;
////							  }
////						  };
////						  this.update = function () {
////							  if (atualize instanceof Function) atualize(delta);
////							  update();
////						  };
////						  this.draw = function () {
////							  if (desenhe instanceof Function) desenhe(delta);
////							  draw();
////						  };
////						  this.loaded = function () {
////							  return loaded();
////						  };
////						  this.image = function () {
////							  return image();
////						  }
////					  };
////
////					  const Layer = function ($image, atulize, desenhe) {
////						  const image = $image.get(0),
////								loaded = function () {
////									if (image instanceof HTMLImageElement) return image.complete;
////								},
////								draw = function () {
////									if (loaded()) {
////										ctx.drawImage(
////											image,
////											0,
////											-(canvas.width / image.width * image.height - canvas.height),
////											canvas.width,
////											canvas.width / image.width * image.height
////										);
////									}
////								}
////
////						  this.update = function () {
////							  if (atualize instanceof Function) atualize();
////						  };
////						  this.draw = function () {
////							  if (desenhe instanceof Function) desenhe();
////							  draw();
////						  };
////						  this.image = function () {
////							  if ($image.length && image instanceof HTMLImageElement) return image;
////						  };
////						  this.loadead = function () {
////							  loaded();
////						  };
////					  }
////
////					  const Ground = function ($image) {
////						  Layer.call(this, $image);
////					  }
////					  inherit(Ground, Layer);
////
////					  const Teste = function () {
////						  const wind = {
////									'x': 0,
////									'y': 0
////								},
////								g = 0.1,
////								ground = new Ground($('<img>', {
////									'src': './assets/arenas/teste/ground.png'
////								}));
////						  Arena.apply(this, [, ground, g, wind]);
////					  };
////					  inherit(Teste, Arena);
////
////					  const Ringue = function (arena) {
////						  switch (arena) {
////							  case 'teste':
////								  return new Teste();
////						  }
////					  }
////
////					  socket.on('arena', function (ringue) {
////						  arena = Ringue(ringue);
////						  elements.arena = arena;
////						  elements.$arena = $(arena.image()).addClass('asmtfy-arena').insertAfter($canvas);
////						  $(window).on('resize', function () {
////							  elements.$arena.css({
////								  'top': $canvas.offset().top + $canvas.height() * 0.2 + 'px',
////								  'width': $canvas.width() * 0.4 + 'px',
////							  }).css({
////								  'left': ($canvas.width() / 2) - (elements.$arena.width() / 2) + 'px'
////							  });
////						  }).resize();
////					  });
////
////					  elements.$loading_bar = $('<div>', {
////						  'class': 'asmtfy-loading_bar'
////					  }).append(
////						$('<div>', {
////							'class': 'asmtfy-loading_bar__inner'
////						})
////					  ).insertAfter($canvas);
////					  $(window).on('resize', function () {
////						  elements.$loading_bar.css({
////							  'top': $canvas.offset().top + $canvas.height() * 0.9 + 'px',
////							  'width': $canvas.width() * 0.9 + 'px',
////							  'height': $canvas.height() * 0.02 + 'px'
////						  }).children().css({
////							  'width': elements.$loading_bar.width() * loaded() + 'px'
////						  });
////					  }).resize();
////
////					  socket.emit('loading');
////				  },
////				  atualize = function () {
//////					  if (arena isntanceof Arena) {
//////					  	if (loaded() === 1) console.log('loaded');
//////				  	  }
////				  },
//////				  desenhe = function () {
////					  
//////				  },
////				  termine = function () {
////					  elements.$loading_bar.remove();
////					  elements.$arena.remove();
////				  },
//////				  pause = function () {
////					  
//////				  },
//////				  play = function () {
////					  
//////				  },
//////				  stop = function () {
////					  
//////				  },
////				  loaded = function () {
////					  return Object.values(elements).filter(function (element) {
////						  if (!(element.loaded instanceof Function)) return true;
////						  return element.loaded;
////					  }).length / Object.values(elements).length;
////				  };
////			State.apply(this, [elements, atualize, , comece, termine]);
////			this.draw = undefined;
////		}
////		inherit(Loading, State);
////
////		const state = function (state) {
////			if (state instanceof State) {
////				if (estado instanceof State && estado.end instanceof Function) estado.end();
////				estado = state;
////				if (estado.start instanceof Function) estado.start();
////			} else {
////				return estado;
////			}
////		}
////
////		state(new Loading());
////
////		window.requestAnimationFrame(function loop() {
////			now = Date.now();
////			delta = now - before;
////			before = now;
////
////			if (state().update instanceof Function) state().update();
////			ctx.clearRect(0, 0, canvas.width, canvas.height);
////			if (state().draw instanceof Function) state().draw();
////
////			window.requestAnimationFrame(loop);
////		});
////	})();
////});