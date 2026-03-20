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
  });

  // Language swap button
  $(document).on('click', '.lang-arrow', function() {
    var $src = $('#srcLang');
    var $tgt = $('#tgtLang');
    var srcIdx = $src.prop('selectedIndex');
    var tgtIdx = $tgt.prop('selectedIndex');
    $src.prop('selectedIndex', tgtIdx);
    $tgt.prop('selectedIndex', srcIdx);
    HuAnim.toast('언어 쌍이 변경되었습니다', 'info');
  });

  // Helper: get current form values for analysis
  function getFormValues() {
    var srcLang = $('.lang-pair select').eq(0).find('option:selected').text().replace(/\(.*\)/, '').trim();
    var tgtLang = $('.lang-pair select').eq(1).find('option:selected').text().replace(/\(.*\)/, '').trim();
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

    // Update confirmation section left side
    var $confirmRows = $('.confirm-detail-left .confirm-detail-row');
    $confirmRows.eq(0).find('.detail-value').text(vals.langPair);
    $confirmRows.eq(1).find('.detail-value').text(vals.fieldFull);
    $confirmRows.eq(3).find('.detail-value').text(vals.deadline);
    $confirmRows.eq(4).find('.detail-value').text(vals.budget);

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

  // Next from analysis
  $(document).on('click', '#btnStartMatching', function() {
    HuAnim.showLoading('AI가 최적의 전문가를 매칭하고 있습니다', 3000, function() {
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

  // Expert card click → confirmation
  var selectedExpert = null;
  $(document).on('click', '.expert-card', function() {
    selectedExpert = experts[parseInt($(this).data('expert'))];
    goToSection(4);
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
  // Sidebar & Navigation
  // ===========================
  $('.sidebar-item').on('click', function() {
    $('.sidebar-item').removeClass('active');
    $(this).addClass('active');
  });
});
