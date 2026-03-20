/**
 * HuTech - Shared Animation Utilities
 * 타이핑, 카운트업, 프로그레스, 스켈레톤 등 공통 애니메이션
 */
var HuAnim = (function() {
  'use strict';

  /**
   * 타이핑 애니메이션
   * @param {jQuery} $el - 대상 엘리먼트
   * @param {string} text - 출력할 텍스트
   * @param {number} speed - 글자당 ms (기본 25)
   * @param {function} callback - 완료 콜백
   */
  function typeText($el, text, speed, callback) {
    speed = speed || 25;
    var i = 0;
    $el.html('<span class="typing-cursor">|</span>');
    var interval = setInterval(function() {
      if (i < text.length) {
        var char = text.charAt(i);
        if (char === '\n') {
          $el.find('.typing-cursor').before('<br>');
        } else {
          $el.find('.typing-cursor').before(document.createTextNode(char));
        }
        i++;
      } else {
        clearInterval(interval);
        $el.find('.typing-cursor').remove();
        if (callback) callback();
      }
    }, speed);
    return interval;
  }

  /**
   * 숫자 카운트업 애니메이션
   * @param {jQuery} $el - 대상 엘리먼트
   * @param {number} target - 목표 숫자
   * @param {number} duration - 애니메이션 시간 ms (기본 2000)
   * @param {string} suffix - 뒤에 붙일 문자 (기본 '%')
   * @param {function} callback - 완료 콜백
   */
  function countUp($el, target, duration, suffix, callback) {
    duration = duration || 2000;
    suffix = suffix || '%';
    var start = 0;
    var startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var current = Math.round(eased * target * 10) / 10;
      $el.text(current.toFixed(1) + suffix);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        $el.text(target.toFixed(1) + suffix);
        if (callback) callback();
      }
    }
    requestAnimationFrame(animate);
  }

  /**
   * SVG 원형 프로그레스 애니메이션
   * @param {jQuery} $circle - SVG circle 엘리먼트
   * @param {number} percent - 0~100
   * @param {number} duration - ms (기본 2000)
   */
  function fillCircle($circle, percent, duration) {
    duration = duration || 2000;
    var r = parseFloat($circle.attr('r'));
    var circumference = 2 * Math.PI * r;
    $circle.css({
      'stroke-dasharray': circumference,
      'stroke-dashoffset': circumference
    });
    var targetOffset = circumference - (percent / 100) * circumference;

    setTimeout(function() {
      $circle.css({
        'transition': 'stroke-dashoffset ' + duration + 'ms ease-out',
        'stroke-dashoffset': targetOffset
      });
    }, 50);
  }

  /**
   * 스켈레톤 로딩 → 실제 콘텐츠 전환
   * @param {jQuery} $el - 대상 엘리먼트
   * @param {number} duration - 스켈레톤 표시 시간 ms
   * @param {function} callback - 전환 후 콜백
   */
  function shimmerLoad($el, duration, callback) {
    $el.addClass('skeleton-loading');
    setTimeout(function() {
      $el.removeClass('skeleton-loading');
      $el.addClass('fade-in');
      if (callback) callback();
    }, duration);
  }

  /**
   * 엘리먼트 순차 등장 애니메이션
   * @param {jQuery} $elements - 대상 엘리먼트들
   * @param {number} delay - 각 엘리먼트 간 딜레이 ms (기본 300)
   * @param {function} callback - 모두 완료 후 콜백
   */
  function staggerReveal($elements, delay, callback) {
    delay = delay || 300;
    $elements.css({ opacity: 0, transform: 'translateY(20px)' });
    $elements.each(function(i) {
      var $el = $(this);
      setTimeout(function() {
        $el.css({
          transition: 'all 0.4s ease-out',
          opacity: 1,
          transform: 'translateY(0)'
        });
        if (i === $elements.length - 1 && callback) {
          setTimeout(callback, 400);
        }
      }, i * delay);
    });
  }

  /**
   * 스텝 전환 슬라이드 애니메이션
   * @param {jQuery} $out - 나가는 섹션
   * @param {jQuery} $in - 들어오는 섹션
   * @param {function} callback - 완료 콜백
   */
  function slideTransition($out, $in, callback) {
    $out.css({ transition: 'all 0.3s ease-in', opacity: 0, transform: 'translateX(-30px)' });
    setTimeout(function() {
      $out.hide().css({ opacity: 1, transform: 'translateX(0)' });
      $in.css({ opacity: 0, transform: 'translateX(30px)' }).show();
      setTimeout(function() {
        $in.css({ transition: 'all 0.3s ease-out', opacity: 1, transform: 'translateX(0)' });
        if (callback) setTimeout(callback, 300);
      }, 50);
    }, 300);
  }

  /**
   * 프로그레스 바 채우기
   * @param {jQuery} $bar - .progress-bar-fill 엘리먼트
   * @param {number} percent - 0~100
   * @param {number} duration - ms (기본 1500)
   */
  function fillBar($bar, percent, duration) {
    duration = duration || 1500;
    $bar.css({ width: 0 });
    setTimeout(function() {
      $bar.css({
        transition: 'width ' + duration + 'ms ease-out',
        width: percent + '%'
      });
    }, 50);
  }

  /**
   * 로딩 오버레이 표시/숨김
   * @param {string} message - 로딩 메시지
   * @param {number} duration - 표시 시간 ms
   * @param {function} callback - 완료 콜백
   */
  function showLoading(message, duration, callback) {
    var $overlay = $('<div class="loading-overlay"><div class="loading-content">' +
      '<div class="loading-spinner"></div>' +
      '<p class="loading-text">' + message + '</p>' +
      '<div class="loading-dots"><span>.</span><span>.</span><span>.</span></div>' +
      '</div></div>');
    $('body').append($overlay);
    setTimeout(function() { $overlay.addClass('active'); }, 10);

    setTimeout(function() {
      $overlay.removeClass('active');
      setTimeout(function() {
        $overlay.remove();
        if (callback) callback();
      }, 300);
    }, duration);
  }

  /**
   * 토스트 알림
   * @param {string} message - 알림 메시지
   * @param {string} type - 'success' | 'info' | 'warning'
   * @param {number} duration - 표시 시간 ms (기본 3000)
   */
  function toast(message, type, duration) {
    type = type || 'success';
    duration = duration || 3000;
    var icons = { success: 'bi-check-circle-fill', info: 'bi-info-circle-fill', warning: 'bi-exclamation-circle-fill' };
    var $toast = $('<div class="hu-toast hu-toast-' + type + '">' +
      '<i class="bi ' + icons[type] + '"></i> ' + message + '</div>');
    $('body').append($toast);
    setTimeout(function() { $toast.addClass('show'); }, 10);
    setTimeout(function() {
      $toast.removeClass('show');
      setTimeout(function() { $toast.remove(); }, 300);
    }, duration);
  }

  return {
    typeText: typeText,
    countUp: countUp,
    fillCircle: fillCircle,
    shimmerLoad: shimmerLoad,
    staggerReveal: staggerReveal,
    slideTransition: slideTransition,
    fillBar: fillBar,
    showLoading: showLoading,
    toast: toast
  };
})();
