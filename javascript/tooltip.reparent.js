// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Tooltip reparent component
// -----------------------------------------------------------------------------

// This attempts to reparent tooltips outside of all elements that have styles
// that cause visual inconsistencies due to tooltips inheriting things like
// font sizes or layout constraints.

AmbientImpact.on(['fastdom', 'tooltip'], function(aiFastDom, aiTooltip) {
AmbientImpact.addComponent('OmnipediaSiteThemeTooltipReparent', function(
  component, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * Class identifying a reparent container.
   *
   * This is used when reparenting because Tippy only supports specifying an
   * element to append to, but provides no API to specify where in a container
   * to insert the tooltip. While we could figure out how to move the tooltip,
   * that might break in future versions of Tippy or under unexpected
   * circumstances, so inserting this element and then telling Tippy to append
   * to it is the safest way to do this.
   *
   * @type {String}
   */
  const reparentElementClass = 'tooltip-reparent-container';

  /**
   * An array of container element selectors to reparent tooltips outside of.
   *
   * @type {Array}
   */
  const reparentSelectors = [
    '.omnipedia-infobox',
    '.omnipedia-media-group',
    '.omnipedia-media',
    'blockquote',
    'strong',
    'em',
    'sup',
  ];

  /**
   * Custom Tippy.js appendTo callback.
   *
   * @param {HTMLElement} reference
   *
   * @return {HTMLElement}
   *
   * @see https://atomiks.github.io/tippyjs/v6/all-props/#appendto
   */
  function appendTo(reference) {

    /**
     * The element to insert the tooltip after, in a jQuery collection.
     *
     * This defaults to the reference element if no container is found below.
     *
     * @type {jQuery}
     */
    let $reference = $(reference);

    // Use the <body> if not interactive to match the default Tippy behaviour.
    if ($reference.prop('_tippy').props.interactive === false) {
      return document.body;
    }

    /**
     * The ancestor element that tooltips should be placed after.
     *
     * Since jQuery().parents() can filter by a provided selector,
     * starting from closest and going up the tree, we can limit results to only
     * the selectors we're looking to insert outside of. By using
     * jQuery().last(), we can reduce the set down to the highest level
     * ancestor, i.e. the one that potentially contains one or more of
     * these, i.e. multiple matching parents. For example, if an infobox
     * contains a media element, this will choose the infobox as that's
     * higher up the tree.
     *
     * @type {jQuery}
     *
     * @see https://api.jquery.com/parents/
     */
    const $container = $reference.parents(reparentSelectors.join(',')).last();

    // If we didn't find one of the reparent elements, just return the reference
    // element's parent to match the default Tippy behaviour.
    if ($container.length === 0) {
      return $reference.parent()[0];
    }

    /**
     * The element to insert the tooltip after, in a jQuery collection.
     *
     * This defaults to the container if no further changes are made below.
     *
     * @type {jQuery}
     */
    let $insertAfter = $container;

    /**
     * The next sibling node to the container, or null if none.
     *
     * @type {HTMLElement|null}
     */
    const nextSibling = $insertAfter[0].nextSibling;

    // If the next sibling is a text node, set $insertAfter to that text node
    // rather than the container.
    //
    // This fixes an issue in Chrome that could cause white-space after the
    // container to collapse the first time that a tooltip would be inserted
    // right after the container.
    if (nextSibling !== null && nextSibling.nodeName === '#text') {
      $insertAfter = $(nextSibling);
    }

    const $nextReparent = $insertAfter.next(`.${reparentElementClass}`);

    if ($nextReparent.length > 0) {
      return $nextReparent[0];
    }

    const $reparent = $(`<span class="${reparentElementClass}"></span>`);

    // Note that we can't use FastDom here because we can't define this appendTo
    // function as async due to Tippy not supporting that at the time of
    // writing.
    //
    // @todo Revisit this if/when Tippy supports async appendTo callbacks.
    $reparent.insertAfter($insertAfter);

    return $reparent[0];

  }

  this.addBehaviour(
    'OmnipediaSiteThemeTooltipReparent',
    'omnipedia-site-theme-tooltip-reparent',
    'body',
    function(context, settings) {

      $(this).on(`tooltipCreate.${eventNamespace}`, function(event) {

        event.instance.setProps({appendTo: appendTo});

      });

    },
    async function(context, settings, trigger) {

      const $this = $(this);

      $(this).off(`tooltipCreate.${eventNamespace}`);

      await fastdom.mutate(function() {
        $this.find(`.${reparentElementClass}`).remove();
      });

    }
  );


});
});
