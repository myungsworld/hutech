$(function() {
  'use strict';

  // ===========================
  // Category Tab Switching (pill style)
  // ===========================
  $('.category-tabs .tab-pill').on('click', function() {
    $('.category-tabs .tab-pill').removeClass('active');
    $(this).addClass('active');
  });

  // ===========================
  // Sidebar Item Switching
  // ===========================
  $('.sidebar-item').on('click', function() {
    $('.sidebar-item').removeClass('active');
    $(this).addClass('active');
  });

  // ===========================
  // Workflow Stepper
  // ===========================
  $('.step-item').on('click', function() {
    var $items = $('.step-item');
    var $connectors = $('.step-connector');
    var idx = $items.index(this);

    $items.removeClass('active');
    $connectors.removeClass('active');

    for (var i = 0; i <= idx; i++) {
      $items.eq(i).addClass('active');
    }
    for (var j = 0; j < idx; j++) {
      $connectors.eq(j).addClass('active');
    }
  });

  // ===========================
  // Settings Panel Toggle
  // ===========================
  $('#toggleSettings').on('click', function() {
    var $body = $('#settingsBody');
    var $icon = $(this).find('i');
    $body.toggleClass('collapsed');
    $icon.toggleClass('bi-chevron-up bi-chevron-down');
  });

  // ===========================
  // Toggle Button Group
  // ===========================
  $('.toggle-btn').on('click', function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });

  // ===========================
  // AI Chip Selection
  // ===========================
  $('.ai-chip').on('click', function() {
    $(this).toggleClass('selected');
    var $input = $(this).find('input');
    $input.prop('checked', !$input.prop('checked'));
  });

  // ===========================
  // Upload Zone - Drag & Drop
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
      if (files.length > 0) {
        addFileTags(files);
      }
    }
  });

  $dropZone.on('click', function() {
    var $input = $('<input type="file" multiple accept=".pdf,.docx,.txt,.png,.jpg">');
    $input.on('change', function() {
      addFileTags(this.files);
    });
    $input.trigger('click');
  });

  function addFileTags(files) {
    var $container = $('#fileTags');
    for (var i = 0; i < files.length; i++) {
      var ext = files[i].name.split('.').pop().toLowerCase();
      var icon = ext === 'pdf' ? 'bi-file-pdf' : 'bi-file-earmark';
      var tag = '<span class="file-tag">' +
        '<i class="bi ' + icon + '"></i> ' +
        files[i].name +
        ' <button class="tag-remove">&times;</button>' +
        '</span>';
      $container.append(tag);
    }
  }

  // ===========================
  // File Tag Remove
  // ===========================
  $(document).on('click', '.tag-remove', function(e) {
    e.stopPropagation();
    $(this).parent().fadeOut(150, function() {
      $(this).remove();
    });
  });

  // ===========================
  // Chat Input - Auto resize textarea
  // ===========================
  var $textarea = $('#chatInput');

  $textarea.on('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  $textarea.on('keydown', function(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  $('.btn-send').on('click', function() {
    sendMessage();
  });

  function sendMessage() {
    var text = $textarea.val().trim();
    if (text) {
      // 에디터 페이지로 이동
      window.location.href = 'editor.html';
    }
  }

  // ===========================
  // 워크플로우 step 2 클릭 시 에디터로
  // ===========================
  $('.step-item').on('click', function() {
    var label = $(this).find('.step-label').text();
    if (label === '양식 만들기' || label === '내용 작성') {
      window.location.href = 'editor.html';
    }
  });

  // ===========================
  // Suggest card click
  // ===========================
  $('.suggest-card').on('click', function() {
    window.location.href = 'editor.html';
  });
});
