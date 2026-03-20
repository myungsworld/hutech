/**
 * HuTech - Auto Document Demo (자동문서 프로세스)
 * Step 1: Upload/Input → Step 2: AI Generation → Step 3: Editing → Step 4: AI Evaluation → Step 5: Output
 */
$(function() {
  'use strict';

  var currentStep = 1;

  // ===========================
  // Pre-written AI Responses (simulated)
  // ===========================
  var aiResponses = {
    chatgpt: {
      title: '고소장',
      versions: [
        '피고소인의 아래 범죄사실에 대하여 고소하오니 수사하여 엄벌에 처하여 주시기 바랍니다.\n\n' +
        '피고소인은 2024년 3월경부터 2024년 8월경까지 서울특별시 강남구 소재 ○○오피스텔에서, ' +
        '고소인의 저작물인 번역 원고를 무단으로 복제하여 제3자에게 판매하였습니다.\n\n' +
        '이는 저작권법 제136조 제1항 제1호에 해당하는 저작재산권 침해 행위로서, ' +
        '피고소인의 행위로 인해 고소인은 약 5,000만 원 상당의 재산적 손해를 입었습니다.\n\n' +
        '이에 피고소인을 저작권법 위반으로 고소하오니, 철저히 수사하여 주시기 바랍니다.',

        '고소인은 피고소인의 저작권법 위반 행위에 대하여 아래와 같이 고소합니다.\n\n' +
        '1. 고소 취지\n' +
        '피고소인을 저작권법 제136조 제1항 위반 혐의로 처벌하여 주시기 바랍니다.\n\n' +
        '2. 범죄사실\n' +
        '피고소인은 2024. 3.경부터 같은 해 8.경까지 서울 강남구에 있는 자신의 사무실에서, ' +
        '고소인이 창작한 전문 번역 원고 총 15건을 권리자인 고소인의 허락 없이 무단 복제한 뒤 ' +
        '온라인 플랫폼을 통해 제3자에게 유상 배포하였습니다.\n\n' +
        '3. 적용 법조\n' +
        '저작권법 제136조 제1항 제1호 (저작재산권 침해)\n\n' +
        '4. 입증 자료\n' +
        '- 고소인 원본 원고 및 작업 이력 (증 제1호)\n' +
        '- 피고소인 판매 내역 캡처 (증 제2호)\n' +
        '- 피해 금액 산출 내역서 (증 제3호)'
      ],
      content: '',
      time: '3.2초',
      tokens: '287',
      versionIndex: 0
    },
    gemini: {
      title: '고소장',
      versions: [
        '아래와 같이 피고소인의 범죄사실을 고소하오니, 수사 후 엄중 처벌하여 주시기 바랍니다.\n\n' +
        '【범죄사실 요약】\n' +
        '피고소인은 2024년 3월부터 동년 8월까지 약 6개월간에 걸쳐, 고소인이 창작한 전문 번역 원고(총 15건)를 ' +
        '고소인의 동의 없이 복제·배포하여 부당이익을 취하였습니다.\n\n' +
        '【적용 법조】\n' +
        '저작권법 제136조(벌칙) 제1항: 저작재산권을 복제·배포 등의 방법으로 침해한 자는 ' +
        '5년 이하의 징역 또는 5천만원 이하의 벌금에 처합니다.\n\n' +
        '【피해 규모】\n' +
        '- 직접 손해: 원고 판매 대금 약 3,500만원\n' +
        '- 간접 손해: 신뢰도 하락으로 인한 거래처 이탈 약 1,500만원',

        '피고소인의 저작권법 위반 행위를 아래와 같이 고소합니다.\n\n' +
        '【사건 경위】\n' +
        '고소인은 전문 번역사로서 법률·기술 분야 번역 서비스를 제공하고 있으며, ' +
        '피고소인은 고소인에게 번역을 의뢰한 고객입니다. 피고소인은 납품받은 번역물을 ' +
        '계약 범위를 초과하여 무단 복제·판매하였습니다.\n\n' +
        '【범죄 일시 및 장소】\n' +
        '- 일시: 2024년 3월 ~ 2024년 8월\n' +
        '- 장소: 서울특별시 강남구 소재 피고소인 사무실\n\n' +
        '【피해 내역】\n' +
        '번역 원고 15건 무단 복제·배포, 피해액 약 5,000만원'
      ],
      content: '',
      time: '2.8초',
      tokens: '312',
      versionIndex: 0
    },
    wrtn: {
      title: '고소장',
      versions: [
        '존경하는 수사기관 귀중\n\n' +
        '고소인은 아래 범죄사실에 관하여 피고소인을 저작권법 위반으로 고소합니다.\n\n' +
        '1. 사건 개요\n' +
        '고소인은 전문 번역 서비스를 제공하는 번역사로서, 피고소인과 2024년 1월 번역 용역 계약을 체결한 바 있습니다. ' +
        '그러나 피고소인은 계약 범위를 벗어나 고소인의 번역 원고를 무단 복제하여 자신의 명의로 판매하였습니다.\n\n' +
        '2. 구체적 범죄사실\n' +
        '가. 피고소인은 2024년 3월경 고소인의 영한 번역 원고 10건을 무단 복제\n' +
        '나. 동년 5월경 상기 원고를 자신의 번역물로 위장하여 온라인 플랫폼에 게시\n' +
        '다. 동년 8월까지 약 5,000만원 상당의 부당이익 취득',

        '수사기관 귀중\n\n' +
        '아래 범죄사실을 고소하오니, 엄정히 수사하여 주시기 바랍니다.\n\n' +
        '1. 당사자 관계\n' +
        '고소인은 영한 전문 번역사이며, 피고소인은 2024년 1월 고소인에게 번역 용역을 의뢰한 자입니다.\n\n' +
        '2. 범죄사실\n' +
        '피고소인은 고소인이 납품한 번역 원고(법률 분야 15건)를 계약상 허용된 용도 이외에 ' +
        '무단으로 복제하여 자신의 이름으로 온라인에서 판매하였습니다. ' +
        '이로 인해 고소인은 약 5,000만원의 재산적 피해를 입었습니다.\n\n' +
        '3. 관련 법조: 저작권법 제136조 제1항 제1호'
      ],
      content: '',
      time: '4.1초',
      tokens: '298',
      versionIndex: 0
    },
    claude: {
      title: '고소장',
      versions: [
        '본 고소장은 피고소인의 저작권법 위반 행위에 대하여 엄정한 수사와 처벌을 구하기 위해 제출합니다.\n\n' +
        '■ 고소 취지\n' +
        '피고소인을 저작권법 제136조 제1항 위반으로 고소하오니, 수사하여 처벌하여 주시기 바랍니다.\n\n' +
        '■ 범죄사실\n' +
        '피고소인은 고소인이 2023년 12월부터 2024년 2월까지 작성한 전문 번역 원고(법률 문서 번역 15건, ' +
        '기술 문서 번역 8건, 총 23건)를 2024년 3월부터 8월까지 무단으로 복제하여 ' +
        '온라인 번역 플랫폼 3곳에서 자신의 결과물로 판매하였습니다.\n\n' +
        '■ 증거 자료\n' +
        '1. 원본 번역 원고 및 작업 일지 (증거 1호)\n' +
        '2. 피고소인의 판매 게시물 스크린샷 (증거 2호)\n' +
        '3. 결제 내역 확인서 (증거 3호)\n' +
        '4. 고소인-피고소인 간 계약서 사본 (증거 4호)',

        '■ 고소 요지\n' +
        '피고소인의 저작재산권 침해 행위(저작권법 제136조 제1항)에 대하여 고소합니다.\n\n' +
        '■ 사실관계\n' +
        '고소인은 전문 번역사로서 법률·기술 분야의 번역 용역을 수행하고 있습니다. ' +
        '피고소인은 2024년 1월 고소인에게 번역을 의뢰한 후, 납품받은 번역물 23건을 ' +
        '2024년 3월부터 8월까지 고소인의 허락 없이 제3의 플랫폼에서 판매하였습니다.\n\n' +
        '■ 피해 규모\n' +
        '- 번역 원고 23건 (법률 15건 + 기술 8건)\n' +
        '- 무단 판매 플랫폼: 3곳\n' +
        '- 추정 피해액: 약 5,000만원\n\n' +
        '■ 첨부 증거 목록\n' +
        '증 제1호 내지 증 제4호 (별첨)'
      ],
      content: '',
      time: '3.7초',
      tokens: '341',
      versionIndex: 0
    }
  };

  // Initialize content from first version
  Object.keys(aiResponses).forEach(function(key) {
    aiResponses[key].content = aiResponses[key].versions[0];
  });

  var evaluationData = {
    overall: 91.3,
    grade: 'A+',
    scores: [
      { label: '정확성', desc: '법률 용어 및 사실관계의 정확도', value: 94.2, color: '#10a37f' },
      { label: '적합성', desc: '고소장 양식 및 법적 요건 충족도', value: 88.5, color: '#f5a623' },
      { label: '표현성', desc: '문장 구성 및 논리적 전개의 완성도', value: 91.1, color: '#10a37f' }
    ],
    subScores: [
      { name: '법률 용어 정확성', score: 95, color: '#10a37f' },
      { name: '사실관계 명확성', score: 92, color: '#10a37f' },
      { name: '양식 적합성', score: 88, color: '#f5a623' },
      { name: '논리적 구조', score: 90, color: '#10a37f' },
      { name: '문장 가독성', score: 93, color: '#10a37f' },
      { name: '증거 인용 적절성', score: 86, color: '#f5a623' }
    ],
    feedback: [
      { type: 'good', icon: 'bi-check-lg', text: '<strong>법률 용어 사용이 정확합니다.</strong> 저작권법 제136조 인용이 적절하며, 고소 요건을 충족합니다.' },
      { type: 'good', icon: 'bi-check-lg', text: '<strong>범죄사실 기술이 구체적입니다.</strong> 시간, 장소, 행위가 명확하게 특정되어 있습니다.' },
      { type: 'warn', icon: 'bi-exclamation-lg', text: '<strong>피해 금액 산정 근거 보완 필요.</strong> 5,000만원의 산출 근거를 구체적으로 명시하면 설득력이 높아집니다.' },
      { type: 'improve', icon: 'bi-arrow-up', text: '<strong>증거 자료 목록 추가 권장.</strong> 증거 자료의 구체적 목록과 번호를 본문에 포함하면 좋겠습니다.' }
    ]
  };

  // ===========================
  // Step Navigation
  // ===========================
  function goToStep(step) {
    if (step === currentStep) return;
    var $current = $('#step' + currentStep);
    var $next = $('#step' + step);

    // Update stepper
    var $items = $('.step-item');
    var $connectors = $('.step-connector');
    $items.removeClass('active completed');
    $connectors.removeClass('active');
    for (var i = 0; i < step; i++) {
      $items.eq(i).addClass(i < step - 1 ? 'completed' : 'active');
    }
    for (var j = 0; j < step - 1; j++) {
      $connectors.eq(j).addClass('active');
    }

    HuAnim.slideTransition($current, $next, function() {
      currentStep = step;
      onStepEnter(step);
    });
  }

  function onStepEnter(step) {
    if (step === 2) startAIGeneration();
    if (step === 4) startEvaluation();
    if (step === 5) showFinalOutput();
  }

  // Step click
  $(document).on('click', '.step-item', function() {
    var idx = $('.step-item').index(this) + 1;
    if (idx <= currentStep + 1) {
      goToStep(idx);
    }
  });

  // Next/Prev buttons
  $(document).on('click', '[data-next-step]', function() {
    var nextStep = parseInt($(this).attr('data-next-step'));
    if (nextStep === 2) {
      // Step 1 → 2: Show loading first
      HuAnim.showLoading('AI가 문서를 분석하고 생성 중입니다', 2500, function() {
        goToStep(2);
      });
    } else {
      goToStep(nextStep);
    }
  });

  $(document).on('click', '[data-prev-step]', function() {
    goToStep(parseInt($(this).attr('data-prev-step')));
  });

  // ===========================
  // Step 1: Upload & Input
  // ===========================
  var $dropZone = $('#dropZone');

  $dropZone.on('dragover', function(e) {
    e.preventDefault();
    $(this).addClass('dragover');
  });
  $dropZone.on('dragleave drop', function(e) {
    e.preventDefault();
    $(this).removeClass('dragover');
    if (e.type === 'drop') {
      var files = e.originalEvent.dataTransfer.files;
      if (files.length > 0) handleUpload(files);
    }
  });
  $dropZone.on('click', function() {
    var $input = $('<input type="file" multiple accept=".pdf,.docx,.txt,.png,.jpg">');
    $input.on('change', function() { handleUpload(this.files); });
    $input.trigger('click');
  });

  function handleUpload(files) {
    var $tags = $('#fileTags');
    for (var i = 0; i < files.length; i++) {
      var ext = files[i].name.split('.').pop().toLowerCase();
      var icon = ext === 'pdf' ? 'bi-file-pdf' : 'bi-file-earmark';
      $tags.append('<span class="file-tag"><i class="bi ' + icon + '"></i> ' +
        files[i].name + ' <button class="tag-remove">&times;</button></span>');
    }
    HuAnim.toast('파일이 업로드되었습니다', 'success');
  }

  $(document).on('click', '.tag-remove', function(e) {
    e.stopPropagation();
    $(this).parent().fadeOut(150, function() { $(this).remove(); });
  });

  // Chat input
  var $textarea = $('#chatInput');
  $textarea.on('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  $textarea.on('keydown', function(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      submitStep1();
    }
  });
  $('.btn-send').on('click', submitStep1);

  function submitStep1() {
    HuAnim.showLoading('AI가 문서를 분석하고 생성 중입니다', 2500, function() {
      goToStep(2);
    });
  }

  // Settings toggle
  $('#toggleSettings').on('click', function() {
    var $body = $('#settingsBody');
    var $icon = $(this).find('i');
    $body.toggleClass('collapsed');
    $icon.toggleClass('bi-chevron-up bi-chevron-down');
  });

  // AI chip toggle
  $('.ai-chip').on('click', function() {
    $(this).toggleClass('selected');
  });

  // Toggle buttons
  $('.toggle-btn').on('click', function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });

  // ===========================
  // Step 2: AI Generation
  // ===========================
  var typingIntervals = {};
  var generatedResponses = {};

  function startAIGeneration() {
    // Start typing for the active tab
    var firstAI = 'chatgpt';
    generateForAI(firstAI);

    // Generate for other AIs in background (with delays)
    setTimeout(function() { generateForAI('gemini'); }, 1000);
    setTimeout(function() { generateForAI('wrtn'); }, 2000);
    setTimeout(function() { generateForAI('claude'); }, 1500);
  }

  function generateForAI(aiName) {
    var data = aiResponses[aiName];
    var $tab = $('.ai-tab[data-ai="' + aiName + '"]');
    var $status = $tab.find('.tab-status');

    $status.text('생성 중...').removeClass('done');

    // If this is the active tab, show typing
    if ($tab.hasClass('active')) {
      var $panel = $('#aiResponseContent');
      typingIntervals[aiName] = HuAnim.typeText($panel, data.content, 20, function() {
        $status.text('완료').addClass('done');
        generatedResponses[aiName] = data.content;
        updateResponseMeta(aiName);
        updateVersionLabel(aiName);
      });
    } else {
      // Simulate background generation
      var genTime = parseInt(parseFloat(data.time) * 1000);
      setTimeout(function() {
        $status.text('완료').addClass('done');
        generatedResponses[aiName] = data.content;
      }, genTime);
    }
  }

  function updateResponseMeta(aiName) {
    var data = aiResponses[aiName];
    $('#responseMeta').html(
      '<span><i class="bi bi-clock"></i> ' + data.time + '</span>' +
      '<span><i class="bi bi-chat-dots"></i> ' + data.tokens + ' tokens</span>'
    );
  }

  // AI Tab switching
  $(document).on('click', '.ai-tab', function() {
    var aiName = $(this).data('ai');
    $('.ai-tab').removeClass('active');
    $(this).addClass('active');

    var $panel = $('#aiResponseContent');

    if (generatedResponses[aiName]) {
      $panel.html(generatedResponses[aiName].replace(/\n/g, '<br>'));
      updateResponseMeta(aiName);
      updateVersionLabel(aiName);
    } else {
      var data = aiResponses[aiName];
      if (typingIntervals[aiName]) clearInterval(typingIntervals[aiName]);
      typingIntervals[aiName] = HuAnim.typeText($panel, data.content, 20, function() {
        generatedResponses[aiName] = data.content;
        updateResponseMeta(aiName);
        updateVersionLabel(aiName);
        $('.ai-tab[data-ai="' + aiName + '"] .tab-status').text('완료').addClass('done');
      });
    }
  });

  // Compare view toggle
  var isCompareView = false;
  $(document).on('click', '#toggleCompare', function() {
    isCompareView = !isCompareView;
    if (isCompareView) {
      $(this).html('<i class="bi bi-layout-sidebar"></i> 단일 보기');
      showCompareView();
    } else {
      $(this).html('<i class="bi bi-grid"></i> 비교 보기');
      hideCompareView();
    }
  });

  function showCompareView() {
    $('#singleView').hide();
    var html = '<div class="compare-grid">';
    var ais = ['chatgpt', 'gemini', 'wrtn', 'claude'];
    var colors = { chatgpt: '#10a37f', gemini: '#4285f4', wrtn: '#d33717', claude: '#7c3aed' };
    var names = { chatgpt: 'ChatGPT', gemini: 'Gemini', wrtn: 'wrtn', claude: 'Claude' };

    ais.forEach(function(ai) {
      var content = generatedResponses[ai] || 'AI가 생성 중입니다...';
      html += '<div class="compare-card">' +
        '<button class="select-btn" data-select-ai="' + ai + '">선택</button>' +
        '<div class="compare-card-header">' +
        '<span class="tab-dot" style="background:' + colors[ai] + '"></span>' +
        names[ai] +
        '</div>' +
        '<div class="compare-card-body">' + content.replace(/\n/g, '<br>') + '</div>' +
        '</div>';
    });
    html += '</div>';
    $('#compareView').html(html).show();
  }

  function hideCompareView() {
    $('#compareView').hide();
    $('#singleView').show();
  }

  // Select AI in compare view
  $(document).on('click', '.select-btn', function() {
    $('.select-btn').removeClass('selected');
    $(this).addClass('selected');
    var ai = $(this).data('select-ai');
    selectedAI = ai;
    HuAnim.toast(ai.charAt(0).toUpperCase() + ai.slice(1) + ' 결과가 선택되었습니다', 'info');
  });

  var selectedAI = 'chatgpt';

  // ===========================
  // Step 2: Regenerate & Copy
  // ===========================
  $(document).on('click', '#btnRegenerate', function() {
    var activeAI = $('.ai-tab.active').data('ai');
    var data = aiResponses[activeAI];

    // Cycle to next version
    data.versionIndex = (data.versionIndex + 1) % data.versions.length;
    data.content = data.versions[data.versionIndex];
    generatedResponses[activeAI] = data.content;

    // Show loading then retype
    var $panel = $('#aiResponseContent');
    $panel.html('<div style="text-align:center;padding:40px;color:var(--text-light);"><i class="bi bi-arrow-repeat" style="font-size:24px;animation:spin 0.8s linear infinite;display:inline-block;"></i><p style="margin-top:8px;font-size:13px;">재생성 중...</p></div>');

    setTimeout(function() {
      if (typingIntervals[activeAI]) clearInterval(typingIntervals[activeAI]);
      typingIntervals[activeAI] = HuAnim.typeText($panel, data.content, 15, function() {
        updateResponseMeta(activeAI);
        updateVersionLabel(activeAI);
      });
    }, 1000);

    HuAnim.toast('AI 답변을 재생성합니다', 'info');
  });

  $(document).on('click', '#btnCopyResponse', function() {
    var activeAI = $('.ai-tab.active').data('ai');
    var content = generatedResponses[activeAI] || aiResponses[activeAI].content;

    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(function() {
        HuAnim.toast('클립보드에 복사되었습니다', 'success');
      });
    } else {
      // Fallback
      var $temp = $('<textarea>').val(content).appendTo('body').select();
      document.execCommand('copy');
      $temp.remove();
      HuAnim.toast('클립보드에 복사되었습니다', 'success');
    }

    // Visual feedback
    var $btn = $('#btnCopyResponse');
    $btn.html('<i class="bi bi-check-lg"></i> 복사됨');
    setTimeout(function() {
      $btn.html('<i class="bi bi-clipboard"></i> 복사');
    }, 2000);
  });

  function updateVersionLabel(aiName) {
    var data = aiResponses[aiName];
    var ver = data.versionIndex + 1;
    var total = data.versions.length;
    $('#responseVersion').text('ver.' + ver + '/' + total);
  }

  // ===========================
  // Step 3: Editor
  // ===========================
  // Helper: update all toolbar button active states based on actual document state
  function updateToolbarState() {
    $('.toolbar-btn[data-cmd]').each(function() {
      var cmd = $(this).data('cmd');
      var val = $(this).data('val') || null;

      if (cmd === 'formatBlock') {
        // Check if current block matches this button's format
        var sel = window.getSelection();
        var isActive = false;
        if (sel.rangeCount > 0) {
          var node = sel.anchorNode;
          if (node && node.nodeType === 3) node = node.parentElement;
          if (node) {
            var tagName = val.replace(/[<>]/g, '').toLowerCase();
            var block = node.closest(tagName);
            if (block) isActive = true;
          }
        }
        $(this).toggleClass('active', isActive);
      } else if (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight') {
        $(this).toggleClass('active', document.queryCommandState(cmd));
      } else {
        // bold, italic, underline, strikeThrough, insertUnorderedList, insertOrderedList
        $(this).toggleClass('active', document.queryCommandState(cmd));
      }
    });
  }

  // Toolbar commands
  $(document).on('click', '.toolbar-btn[data-cmd]', function() {
    var cmd = $(this).data('cmd');
    var val = $(this).data('val') || null;

    // Ensure focus stays in the editor
    var $editor = $('#editorContent');
    if (!$editor.is(':focus')) {
      $editor.focus();
    }

    if (cmd === 'formatBlock') {
      // Toggle: if already that format, revert to <p>
      var sel = window.getSelection();
      var tagName = val.replace(/[<>]/g, '').toLowerCase();
      var isAlready = false;

      if (sel.rangeCount > 0) {
        var node = sel.anchorNode;
        if (node && node.nodeType === 3) node = node.parentElement;
        if (node) {
          var block = node.closest(tagName);
          if (block) isAlready = true;
        }
      }

      if (isAlready) {
        document.execCommand('formatBlock', false, 'p');
      } else {
        document.execCommand('formatBlock', false, val);
      }
    } else if (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight') {
      // Alignment: execCommand toggles internally; just execute
      document.execCommand(cmd, false, null);
    } else {
      // bold, italic, underline, strikeThrough, insertUnorderedList, insertOrderedList
      // All of these toggle natively via execCommand
      document.execCommand(cmd, false, val);
    }

    // Update all toolbar button states after the command
    updateToolbarState();
  });

  // Update toolbar state when selection changes or user types
  $(document).on('keyup mouseup', '#editorContent', function() {
    updateToolbarState();
  });

  // Word count
  $(document).on('input', '#editorContent', function() {
    var text = $(this).text();
    var chars = text.length;
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    $('#charCount').text(chars);
    $('#wordCount').text(words);
    // Sync preview
    $('#previewContent').html($(this).html());
  });

  // Populate editor when entering step 3
  $(document).on('click', '[data-next-step="3"]', function() {
    setTimeout(function() {
      var content = generatedResponses[selectedAI] || aiResponses.chatgpt.content;
      $('#editorContent').html(content.replace(/\n/g, '<br>'));
      $('#previewContent').html(content.replace(/\n/g, '<br>'));
      var chars = content.length;
      $('#charCount').text(chars);
      $('#wordCount').text(content.trim().split(/\s+/).length);
    }, 400);
  });

  // ===========================
  // Step 4: AI Evaluation
  // ===========================
  function startEvaluation() {
    // Animate overall score
    HuAnim.countUp($('#overallValue'), evaluationData.overall, 2500, '%');

    // Animate circular scores
    evaluationData.scores.forEach(function(score, i) {
      var $card = $('.score-card').eq(i);
      var $circle = $card.find('.circle-progress');
      var $value = $card.find('.score-value');
      var scoreClass = score.value >= 90 ? 'score-high' : score.value >= 80 ? 'score-mid' : 'score-low';
      $card.addClass(scoreClass);

      setTimeout(function() {
        HuAnim.fillCircle($circle, score.value, 2000);
        HuAnim.countUp($value, score.value, 2000, '%');
      }, i * 300);
    });

    // Animate sub scores
    setTimeout(function() {
      evaluationData.subScores.forEach(function(sub, i) {
        setTimeout(function() {
          var $row = $('.sub-eval-row').eq(i);
          $row.find('.eval-bar-fill').css({
            width: sub.score + '%',
            background: sub.color
          });
          $row.find('.eval-bar-score').text(sub.score + '%');
        }, i * 200);
      });
    }, 800);

    // Stagger feedback items
    setTimeout(function() {
      HuAnim.staggerReveal($('.feedback-item'), 400);
    }, 1500);
  }

  // ===========================
  // Step 5: Final Output
  // ===========================
  function showFinalOutput() {
    HuAnim.toast('문서가 성공적으로 생성되었습니다!', 'success', 4000);

    // Animate summary values
    setTimeout(function() {
      HuAnim.countUp($('#summaryScore'), evaluationData.overall, 1500, '점');
    }, 500);
  }

  // Output actions
  $(document).on('click', '#btnDownloadPdf', function() {
    HuAnim.toast('PDF 다운로드가 시작됩니다', 'info');
  });
  $(document).on('click', '#btnPrint', function() {
    window.print();
  });
  $(document).on('click', '#btnPublish', function() {
    HuAnim.showLoading('게시 중입니다', 1500, function() {
      HuAnim.toast('문서가 게시되었습니다!', 'success');
    });
  });

  // ===========================
  // Suggest card click → step 2
  // ===========================
  $(document).on('click', '.suggest-card', function() {
    submitStep1();
  });

  // ===========================
  // My Documents Panel Toggle
  // ===========================
  $('#btnMyDocs').on('click', function() {
    var $panel = $('#myDocsPanel');
    if ($panel.is(':visible')) {
      $panel.hide();
    } else {
      $panel.show();
    }
  });

  // ===========================
  // Category Tab Switching
  // ===========================
  $('.category-tabs .tab-pill').on('click', function() {
    $('.category-tabs .tab-pill').removeClass('active');
    $(this).addClass('active');
  });

  // Sidebar
  $('.sidebar-item').on('click', function() {
    $('.sidebar-item').removeClass('active');
    $(this).addClass('active');
  });

});
