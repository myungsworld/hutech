/**
 * HuTech - Matching System Demo (매칭 시스템)
 * Section 1: Request → Section 2: AI Analysis → Section 3: Expert Matching → Section 4: Confirmation
 */
$(function() {
  'use strict';

  var currentSection = 1;

  // ===========================
  // Expert Data (simulated)
  // ===========================
  var experts = [
    {
      name: '김서연',
      avatar: 'S',
      color: '#4285f4',
      spec: '법률 번역 전문가',
      exp: '경력 12년',
      langs: '영어 ↔ 한국어',
      score: 97.2,
      tags: [
        { text: '법률 전문', highlight: true },
        { text: '영한 번역 12년', highlight: true },
        { text: '저작권법 경험', highlight: true },
        { text: '고소장 50건+', highlight: false }
      ],
      reason: '법률 번역 12년 경력, 저작권 관련 고소장 작성 50건 이상의 실적'
    },
    {
      name: '박준호',
      avatar: 'J',
      color: '#10a37f',
      spec: '법률/특허 번역사',
      exp: '경력 9년',
      langs: '영어 ↔ 한국어',
      score: 93.8,
      tags: [
        { text: '법률 전문', highlight: true },
        { text: '특허 번역', highlight: false },
        { text: '영한 번역 9년', highlight: true },
        { text: '국제법 전문', highlight: false }
      ],
      reason: '법률/특허 분야 9년 경력, 국제 저작권 분쟁 사례 다수 보유'
    },
    {
      name: '이하늘',
      avatar: 'H',
      color: '#7c3aed',
      spec: '법률 문서 작성 전문',
      exp: '경력 7년',
      langs: '영어 ↔ 한국어',
      score: 89.4,
      tags: [
        { text: '문서 작성 전문', highlight: true },
        { text: '법률 분야', highlight: true },
        { text: '고소장/소장', highlight: false },
        { text: '빠른 작업', highlight: false }
      ],
      reason: '법률 문서 작성 전문, 평균 납기일 대비 30% 빠른 작업 속도'
    },
    {
      name: '최민지',
      avatar: 'M',
      color: '#d33717',
      spec: '영한 번역 / 감수',
      exp: '경력 5년',
      langs: '영어 ↔ 한국어',
      score: 85.1,
      tags: [
        { text: '영한 번역', highlight: true },
        { text: '감수 전문', highlight: false },
        { text: '학술 번역', highlight: false },
        { text: '법률 경험 有', highlight: false }
      ],
      reason: '감수 전문가로 활동, 법률 분야 번역 경험 보유'
    },
    {
      name: '장현우',
      avatar: 'W',
      color: '#f5a623',
      spec: '다국어 번역가',
      exp: '경력 8년',
      langs: '영어/일어 ↔ 한국어',
      score: 82.6,
      tags: [
        { text: '다국어', highlight: false },
        { text: '영한/일한', highlight: true },
        { text: '계약서 전문', highlight: false },
        { text: '법률 기초', highlight: false }
      ],
      reason: '다국어 번역 8년 경력, 계약서/법률 기초 문서 번역 경험'
    }
  ];

  var analysisData = {
    items: [
      { icon: 'bi-translate', iconClass: 'blue', label: '번역 언어', value: '영어 → 한국어' },
      { icon: 'bi-bookmark-star', iconClass: 'green', label: '전문 분야', value: '법률 (저작권)' },
      { icon: 'bi-speedometer2', iconClass: 'orange', label: '문서 난이도', value: '상급' },
      { icon: 'bi-clock', iconClass: 'purple', label: '예상 소요시간', value: '3~5일' },
      { icon: 'bi-person-badge', iconClass: 'green', label: '권장 전문가 등급', value: 'S급 이상' },
      { icon: 'bi-cash-stack', iconClass: 'orange', label: '예상 비용', value: '150~200만원' }
    ],
    radarScores: {
      accuracy: 90,
      expertise: 95,
      speed: 70,
      cost: 60,
      review: 85
    }
  };

  // ===========================
  // Section Navigation
  // ===========================
  function goToSection(section) {
    var $current = $('#matchSection' + currentSection);
    var $next = $('#matchSection' + section);

    // Update progress
    var $steps = $('.match-progress-step');
    $steps.each(function(i) {
      $(this).toggleClass('active', i < section);
      $(this).toggleClass('current', i === section - 1);
    });

    HuAnim.slideTransition($current, $next, function() {
      currentSection = section;
      onSectionEnter(section);
    });
  }

  function onSectionEnter(section) {
    if (section === 2) startAnalysis();
    if (section === 3) startMatching();
    if (section === 4) showConfirmation();
  }

  // ===========================
  // Section 1: Request Form
  // ===========================
  // Budget slider
  $('#budgetRange').on('input', function() {
    var val = parseInt($(this).val());
    $('#budgetValue').text(val.toLocaleString() + '만원');
    updateCostEstimate();
  });

  // Language swap button
  $('#btnLangSwap').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var srcVal = document.getElementById('srcLang').value;
    var tgtVal = document.getElementById('tgtLang').value;
    document.getElementById('srcLang').value = tgtVal;
    document.getElementById('tgtLang').value = srcVal;
    updateCostEstimate();
    HuAnim.toast(
      $('#srcLang option:selected').text() + ' → ' + $('#tgtLang option:selected').text(),
      'info'
    );
  });

  // Helper: get current form values for analysis
  function getFormValues() {
    var srcLang = $('#srcLang option:selected').text().replace(/\(.*\)/, '').trim();
    var tgtLang = $('#tgtLang option:selected').text().replace(/\(.*\)/, '').trim();
    var field = $('.form-group select').filter(function() {
      return $(this).closest('.form-group').find('label').text().indexOf('전문 분야') >= 0;
    }).val() || '법률';
    var subField = $('.form-group select').filter(function() {
      return $(this).closest('.form-group').find('label').text().indexOf('세부 분야') >= 0;
    }).val() || '';
    var budget = $('#budgetValue').text() || '200만원';
    var deadline = $('input[type="date"]').val() || '';

    return {
      srcLang: srcLang,
      tgtLang: tgtLang,
      langPair: srcLang + ' → ' + tgtLang,
      field: field,
      subField: subField,
      fieldFull: subField ? field + ' (' + subField + ')' : field,
      budget: budget,
      deadline: deadline
    };
  }

  // Submit form
  $('#btnSubmitRequest').on('click', function() {
    // Update analysis section with current form values before transitioning
    var vals = getFormValues();

    // Update analysis items with actual form values
    var $items = $('.analysis-item');
    $items.eq(0).find('.analysis-value').text(vals.langPair);
    $items.eq(1).find('.analysis-value').text(vals.fieldFull);
    // Update cost in analysis
    var cost = $('#costEstimateValue').text();
    $items.eq(5).find('.analysis-value').text(cost);

    // Update confirmation section left side
    var $confirmRows = $('.confirm-detail-left .confirm-detail-row');
    $confirmRows.eq(0).find('.detail-value').text(vals.langPair);
    $confirmRows.eq(1).find('.detail-value').text(vals.fieldFull);
    $confirmRows.eq(3).find('.detail-value').text(vals.deadline);
    $confirmRows.eq(4).find('.detail-value').text(cost);

    HuAnim.showLoading('AI가 요청을 분석하고 있습니다', 2500, function() {
      goToSection(2);
    });
  });

  // ===========================
  // Section 2: AI Analysis
  // ===========================
  function startAnalysis() {
    // Stagger analysis items
    HuAnim.staggerReveal($('.analysis-item'), 400, function() {
      // Draw radar chart
      animateRadar();
    });
  }

  function animateRadar() {
    var scores = analysisData.radarScores;
    var maxR = 100;
    var cx = 140, cy = 140;

    // Calculate points
    var labels = ['정확성', '전문성', '속도', '비용', '감수'];
    var values = [scores.accuracy, scores.expertise, scores.speed, scores.cost, scores.review];
    var points = [];

    for (var i = 0; i < 5; i++) {
      var angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
      var r = (values[i] / 100) * maxR;
      points.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      });
    }

    var pointsStr = points.map(function(p) { return p.x + ',' + p.y; }).join(' ');

    // Animate: start from center, expand to target
    var $polygon = $('#radarPolygon');
    var centerPoints = Array(5).fill(cx + ',' + cy).join(' ');
    $polygon.attr('points', centerPoints);

    setTimeout(function() {
      $polygon.css('transition', 'all 1s ease-out');
      $polygon.attr('points', pointsStr);

      // Animate dots
      $('.radar-dot').each(function(i) {
        $(this).attr('cx', points[i].x).attr('cy', points[i].y);
      });
    }, 300);
  }

  // Next from analysis - Feature 6: use multi-step progress
  $(document).on('click', '#btnStartMatching', function() {
    showMatchingProgress(function() {
      goToSection(3);
    });
  });

  // ===========================
  // Section 3: Expert Matching
  // ===========================
  function startMatching() {
    var $list = $('#expertList');
    $list.empty();

    // Show skeleton cards first
    for (var s = 0; s < 5; s++) {
      $list.append(
        '<div class="skeleton-card">' +
        '<div class="skeleton-circle"></div>' +
        '<div class="skeleton-lines"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>' +
        '<div class="skeleton-score"></div>' +
        '</div>'
      );
    }

    // Replace skeletons with real cards one by one
    experts.forEach(function(expert, i) {
      setTimeout(function() {
        var $skeleton = $list.find('.skeleton-card').first();
        var isBest = i === 0;

        var tagsHtml = expert.tags.map(function(t) {
          return '<span class="match-tag' + (t.highlight ? ' highlight' : '') + '">' + t.text + '</span>';
        }).join('');

        var cardHtml =
          '<div class="expert-card' + (isBest ? ' best-match' : '') + '" data-expert="' + i + '">' +
          '<div class="expert-rank">' + (i + 1) + '</div>' +
          '<div class="expert-avatar" style="background:' + expert.color + ';">' + expert.avatar + '</div>' +
          '<div class="expert-info">' +
          '<div class="expert-name">' + expert.name + (isBest ? ' <span class="badge-best">최적 매칭</span>' : '') + '</div>' +
          '<div class="expert-meta">' + expert.spec + ' · ' + expert.exp + ' · ' + expert.langs + '</div>' +
          '<div class="expert-tags">' + tagsHtml + '</div>' +
          '</div>' +
          '<div class="expert-score-area">' +
          '<div class="expert-score-value" id="expertScore' + i + '">0.0</div>' +
          '<div class="expert-score-label">적합도</div>' +
          '<div class="expert-score-bar"><div class="expert-score-bar-fill" id="expertBar' + i + '"></div></div>' +
          '</div>' +
          '</div>';

        $skeleton.replaceWith(cardHtml);

        // Animate card appearance
        var $card = $list.find('.expert-card[data-expert="' + i + '"]');
        setTimeout(function() {
          $card.css({ opacity: 1, transform: 'translateY(0)', transition: 'all 0.4s ease-out' });
        }, 50);

        // Animate score count-up
        HuAnim.countUp($('#expertScore' + i), expert.score, 1500, '%');

        // Animate score bar
        setTimeout(function() {
          $('#expertBar' + i).css('width', expert.score + '%');
        }, 200);

      }, 800 + (i * 700));
    });
  }

  // Rematch button - shuffle scores and re-animate
  $(document).on('click', '#btnRematch', function() {
    // Randomize scores slightly and re-sort
    experts.forEach(function(e) {
      var shift = (Math.random() - 0.5) * 15;
      e.score = Math.min(99, Math.max(70, Math.round((e.score + shift) * 10) / 10));
    });
    // Re-sort by score
    experts.sort(function(a, b) { return b.score - a.score; });

    showMatchingProgress(function() {
      startMatching();
      HuAnim.toast('새로운 매칭 결과가 생성되었습니다', 'success');
    });
  });

  // ===========================
  // Feature 4: Expert Detail Modal
  // ===========================
  var expertPortfolios = [
    [
      { name: '국제저작권 분쟁 고소장 번역', date: '2024.08' },
      { name: '특허침해 소송 관련 법률 문서', date: '2024.06' },
      { name: '한미 FTA 계약서 번역', date: '2024.03' }
    ],
    [
      { name: '특허출원 명세서 영한번역', date: '2024.07' },
      { name: '국제중재 판정문 번역', date: '2024.05' },
      { name: '기업 M&A 계약서', date: '2024.02' }
    ],
    [
      { name: '형사고소장 작성 및 번역', date: '2024.09' },
      { name: '민사소장 영문 번역', date: '2024.07' },
      { name: '법원 판결문 번역', date: '2024.04' }
    ],
    [
      { name: '학술논문 영한 번역', date: '2024.08' },
      { name: '의학 임상시험 문서 감수', date: '2024.06' },
      { name: '법률 자문서 번역', date: '2024.04' }
    ],
    [
      { name: '일본어 계약서 번역', date: '2024.09' },
      { name: '영문 NDA 계약서 한글 번역', date: '2024.07' },
      { name: '다국어 마케팅 자료', date: '2024.05' }
    ]
  ];

  var expertReviews = [
    [
      { stars: 5, text: '법률 용어가 정확하고, 원문의 뉘앙스를 잘 살려주셨습니다. 재의뢰 의사 100%입니다.', author: '법률사무소 대표 A' },
      { stars: 5, text: '긴급 건이었는데 빠르게 처리해주셔서 감사합니다. 품질도 매우 만족스럽습니다.', author: '기업 법무팀 B' }
    ],
    [
      { stars: 5, text: '특허 관련 전문 용어 처리가 뛰어납니다. 꼼꼼한 검토까지 해주셔서 좋았습니다.', author: '특허법인 C' },
      { stars: 4, text: '전반적으로 만족하며, 국제법 분야에서도 신뢰할 수 있는 번역가입니다.', author: '로펌 D' }
    ],
    [
      { stars: 4, text: '고소장 양식에 맞게 잘 작성해주셨습니다. 소통이 원활했습니다.', author: '개인 의뢰인 E' },
      { stars: 5, text: '작업 속도가 빠르면서도 정확도가 높아 여러 번 의뢰하고 있습니다.', author: '법률사무소 F' }
    ],
    [
      { stars: 4, text: '감수 품질이 좋습니다. 세심한 부분까지 체크해주셔서 감사합니다.', author: '연구소 G' },
      { stars: 4, text: '학술 번역 경험이 풍부하여 전문 용어 처리가 정확합니다.', author: '대학교수 H' }
    ],
    [
      { stars: 4, text: '다국어 번역이 가능해서 편리합니다. 일본어 번역 품질도 좋았습니다.', author: '무역회사 I' },
      { stars: 4, text: '계약서 형식에 맞게 잘 번역해주셨습니다. 추천합니다.', author: '스타트업 J' }
    ]
  ];

  var selectedExpert = null;
  var selectedExpertIndex = null;

  // Expert card click → show modal
  $(document).on('click', '.expert-card', function() {
    var idx = parseInt($(this).data('expert'));
    var expert = experts[idx];
    selectedExpertIndex = idx;

    // Populate modal
    $('#modalAvatar').text(expert.avatar).css('background', expert.color);
    $('#modalName').text(expert.name);
    $('#modalSpec').text(expert.spec + ' · ' + expert.exp);
    $('#modalScore').text(expert.score + '%');

    // Portfolio
    var portfolioHtml = '';
    expertPortfolios[idx].forEach(function(p) {
      portfolioHtml += '<div class="modal-portfolio-item"><span class="project-name">' + p.name + '</span><span class="project-date">' + p.date + '</span></div>';
    });
    $('#modalPortfolio').html(portfolioHtml);

    // Reviews
    var reviewsHtml = '';
    expertReviews[idx].forEach(function(r) {
      var starsHtml = '';
      for (var s = 0; s < 5; s++) {
        starsHtml += '<i class="bi ' + (s < r.stars ? 'bi-star-fill' : 'bi-star') + '"></i>';
      }
      reviewsHtml += '<div class="modal-review-item">' +
        '<div class="modal-review-stars">' + starsHtml + '</div>' +
        '<div class="modal-review-text">' + r.text + '</div>' +
        '<div class="modal-review-author">- ' + r.author + '</div>' +
        '</div>';
    });
    $('#modalReviews').html(reviewsHtml);

    $('#expertModalOverlay').fadeIn(200);
  });

  // Close modal
  function closeExpertModal() {
    $('#expertModalOverlay').fadeOut(200);
  }
  $('#expertModalClose, #btnModalClose').on('click', closeExpertModal);
  $('#expertModalOverlay').on('click', function(e) {
    if (e.target === this) closeExpertModal();
  });

  // Select expert from modal → go to section 4
  $('#btnModalSelect').on('click', function() {
    selectedExpert = experts[selectedExpertIndex];
    closeExpertModal();
    setTimeout(function() {
      goToSection(4);
    }, 250);
  });

  // ===========================
  // Section 4: Confirmation
  // ===========================
  function showConfirmation() {
    if (!selectedExpert) selectedExpert = experts[0];

    $('#confirmExpertName').text(selectedExpert.name);
    $('#confirmExpertSpec').text(selectedExpert.spec);
    $('#confirmExpertScore').text(selectedExpert.score + '%');
    $('#confirmExpertReason').text(selectedExpert.reason);

    HuAnim.toast('전문가가 선택되었습니다', 'info');
  }

  $(document).on('click', '#btnConfirmMatch', function() {
    HuAnim.showLoading('매칭을 확정하고 있습니다', 2000, function() {
      HuAnim.toast('매칭이 성공적으로 확정되었습니다!', 'success', 5000);
      $('#confirmIcon').html('<i class="bi bi-check-circle-fill" style="font-size:28px;"></i>');
      $('#confirmTitle').text('매칭 완료!');
      $('#confirmDesc').text('전문가에게 알림이 전송되었습니다. 곧 연락이 올 예정입니다.');
      $('#btnConfirmMatch').hide();
      $('#btnNewRequest').show();
    });
  });

  $(document).on('click', '#btnNewRequest', function() {
    location.reload();
  });

  $(document).on('click', '[data-goto-section]', function() {
    goToSection(parseInt($(this).data('goto-section')));
  });

  // ===========================
  // Feature 5: Live Cost Estimate
  // ===========================
  var fieldPrices = { '법률': 150, '의학': 180, '기술/IT': 120, '금융': 160, '마케팅': 100, '학술': 110, '일반': 80 };
  var langMultipliers = {
    'en': 1.0, 'ko': 1.0, 'ja': 1.1,
    'zh': 1.05, 'de': 1.3, 'fr': 1.25
  };

  function updateCostEstimate() {
    var field = $('.form-group select').filter(function() {
      return $(this).closest('.form-group').find('label').text().indexOf('전문 분야') >= 0;
    }).val() || '법률';

    var tgtLang = $('#tgtLang').val() || 'ko';
    var deadline = $('input[type="date"]').val() || '';

    var base = fieldPrices[field] || 100;
    var langMult = langMultipliers[tgtLang] || 1.0;

    // Urgency multiplier based on deadline
    var urgencyMult = 1.0;
    var detail = field + ' 기본 ' + base + '만원';
    if (deadline) {
      var daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 3) {
        urgencyMult = 1.5;
        detail += ' × 긴급(1.5x)';
      } else if (daysLeft <= 7) {
        urgencyMult = 1.2;
        detail += ' × 급행(1.2x)';
      }
    }
    if (langMult !== 1.0) {
      detail += ' × 언어(' + langMult.toFixed(1) + 'x)';
    }

    var total = Math.round(base * langMult * urgencyMult);
    $('#costEstimateValue').text(total + '만원');
    $('#costEstimateDetail').html('<span>' + detail + '</span>');
  }

  // Listen to all form changes
  $(document).on('change', '#matchSection1 select, #matchSection1 input[type="date"]', function() {
    updateCostEstimate();
  });

  // Initial calculation
  updateCostEstimate();

  // ===========================
  // Feature 6: Matching Progress Visualization
  // ===========================
  function showMatchingProgress(callback) {
    var steps = [
      { text: '요구사항 분석 중...', delay: 800 },
      { text: '전문가 DB 검색 중...', delay: 800 },
      { text: '적합도 점수 산출 중...', delay: 800 },
      { text: '최적 매칭 완료!', delay: 600 }
    ];

    var stepsHtml = '';
    steps.forEach(function(s, i) {
      stepsHtml += '<div class="matching-step-item" data-step="' + i + '">' +
        '<div class="matching-step-icon"><span class="step-num-inner">' + (i + 1) + '</span></div>' +
        '<span>' + s.text + '</span></div>';
    });

    var $overlay = $('<div class="matching-progress-overlay">' +
      '<div class="matching-progress-content">' +
      '<div class="loading-spinner"></div>' +
      '<p class="loading-text">AI 전문가 매칭</p>' +
      '<div class="matching-progress-steps">' + stepsHtml + '</div>' +
      '</div></div>');

    $('body').append($overlay);

    var currentIdx = 0;
    function advanceStep() {
      if (currentIdx >= steps.length) {
        // Done - remove overlay
        setTimeout(function() {
          $overlay.fadeOut(300, function() {
            $overlay.remove();
            if (callback) callback();
          });
        }, 400);
        return;
      }

      var $step = $overlay.find('[data-step="' + currentIdx + '"]');
      $step.addClass('active');
      $step.find('.matching-step-icon').html('<div class="matching-step-spinner"></div>');

      setTimeout(function() {
        $step.removeClass('active').addClass('done');
        $step.find('.matching-step-icon').html('<i class="bi bi-check-lg"></i>');
        currentIdx++;
        advanceStep();
      }, steps[currentIdx].delay);
    }

    setTimeout(advanceStep, 200);
  }

  // ===========================
  // Sidebar & Navigation
  // ===========================
  $('.sidebar-item').on('click', function() {
    $('.sidebar-item').removeClass('active');
    $(this).addClass('active');
  });
});
