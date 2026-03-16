$(function() {
  'use strict';

  // ===========================
  // Category Tab Switching
  // ===========================
  $('.category-tabs .tab-item').on('click', function() {
    $('.category-tabs .tab-item').removeClass('active');
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
  // Workflow Button Toggle
  // ===========================
  $('.workflow-btn:not(.primary)').on('click', function() {
    $(this).toggleClass('selected');
    $(this).css('border-color', $(this).hasClass('selected') ? 'var(--primary)' : '');
    $(this).css('color', $(this).hasClass('selected') ? 'var(--primary)' : '');
  });

  // ===========================
  // Upload Zone - Drag & Drop
  // ===========================
  var $dropZone = $('#dropZone');

  $dropZone.on('dragover', function(e) {
    e.preventDefault();
    $(this).css('border-color', 'var(--primary)');
    $(this).css('background', 'var(--primary-light)');
  });

  $dropZone.on('dragleave', function() {
    $(this).css('border-color', '');
    $(this).css('background', '');
  });

  $dropZone.on('drop', function(e) {
    e.preventDefault();
    $(this).css('border-color', '');
    $(this).css('background', '');
    var files = e.originalEvent.dataTransfer.files;
    if (files.length > 0) {
      addFileTags(files);
    }
  });

  $dropZone.on('click', function() {
    var $input = $('<input type="file" multiple>');
    $input.on('change', function() {
      addFileTags(this.files);
    });
    $input.trigger('click');
  });

  // Tooltip on hover
  $dropZone.on('mouseenter', function() {
    $(this).find('.tooltip-box').fadeIn(150);
  }).on('mouseleave', function() {
    $(this).find('.tooltip-box').fadeOut(150);
  });

  function addFileTags(files) {
    var $container = $('.file-tags');
    for (var i = 0; i < files.length; i++) {
      var tag = '<span class="file-tag">' + files[i].name + ' <span class="remove">&times;</span></span>';
      $container.append(tag);
    }
  }

  // ===========================
  // File Tag Remove
  // ===========================
  $(document).on('click', '.file-tag .remove', function() {
    $(this).parent().fadeOut(200, function() {
      $(this).remove();
    });
  });

  // ===========================
  // Chat Input - Enter to Send
  // ===========================
  $('.chat-input-wrap input').on('keypress', function(e) {
    if (e.which === 13) {
      var text = $(this).val().trim();
      if (text) {
        alert('입력한 내용: ' + text);
        $(this).val('');
      }
    }
  });

  $('.chat-input-wrap .btn-send').on('click', function() {
    var $input = $('.chat-input-wrap input');
    var text = $input.val().trim();
    if (text) {
      alert('입력한 내용: ' + text);
      $input.val('');
    }
  });

  // ===========================
  // 문서 만들기 에디터 열기/닫기
  // ===========================
  // "양식 만들기" 또는 "내면의 양식 만들기" 버튼 클릭 시 에디터 열기
  $('.workflow-btn').on('click', function() {
    var text = $(this).text();
    if (text === '내면의 양식 만들기' || text === '양식 만들기') {
      window.location.href = 'editor.html';
    }
  });
});
