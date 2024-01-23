// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars component
// -----------------------------------------------------------------------------

AmbientImpact.on([
  'fastdom',
  'hashMatcher',
  'responsiveStyleProperty',
], function(
  aiFastDom,
  aiHashMatcher,
  aiResponsiveStyleProperty,
) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebars', function(sidebars, $) {

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
   * The CSS custom property name that we watch for the off-canvas state.
   *
   * The expected value should be a string of either:
   *
   * - 'true': the layout is in compact mode with the anchor visible.
   *
   * - 'false': the layout has the sidebars beside the content column, so the
   *   anchor is hidden.
   *
   * This allows us to detect the current state of the sidebars, which
   * delegates the state to CSS without having to hard code any media queries
   * in JavaScript.
   *
   * @type {String}
   */
  const offCanvasStatePropertyName = '--omnipedia-sidebars-off-canvas';

  /**
   * Class added to the sidebars when they're open.
   *
   * This is necessary to ensure the sidebars stay open if the :target selector
   * doesn't kick in despite the hash in the location matching; this can happen
   * when navigating via Hotwire Turbo at the time of writing.
   *
   * @type {String}
   *
   * @see https://www.drupal.org/project/refreshless/issues/3416085
   */
  const sidebarsOpenClass = 'layout-sidebars--open';

  /**
   * Represents the sidebars.
   */
  class Sidebars {

    /**
     * The sidebars container wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$container;

    /**
     * The sidebars close element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$menuClose;

    /**
     * The sidebars closed anchor wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$menuClosedAnchor;

    /**
     * The sidebars closed target element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$menuClosedTarget;

    /**
     * The menu open element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$menuOpen;

    /**
     * The sidebars element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$sidebars;

    /**
     * The hash value stored in the open link's 'hash' property.
     *
     * @type {USVString}
     */
    #menuOpenHash;

    /**
     * Hash matcher instance.
     *
     * @type {hashMatcher}
     */
    #hashMatcher;

    /**
     * A responsive style property instance; watches off canvas state.
     *
     * @type {responsiveStyleProperty}
     */
    #responsiveStyleProperty;

    /**
     * Constructor.
     *
     * @param {jQuery|HTMLElement} $container
     *   The layout container element wrapped in a jQuery collection or as an
     *   HTMLElement.
     */
    constructor($container) {

      this.#$container = $($container);

      this.#$sidebars = this.#$container.find('.layout-sidebars');

      this.#$menuClose = this.#$container.find('.layout-sidebars__close');

      this.#$menuClosedAnchor = this.#$container.find(
        '.layout-sidebars__closed-anchor',
      );

      this.#$menuClosedTarget = this.#$container.find(
        '.layout-sidebars__closed-target',
      );

      this.#$menuOpen = this.#$container.find('.omnipedia-header__menu-link');

      this.#validateElements();

      const beforeConstructEvent = new $.Event(
        'OmnipediaSidebarsBeforeConstruct',
      );

      this.#$sidebars.trigger(beforeConstructEvent, [this]);

      this.#menuOpenHash = this.#$menuOpen.prop('hash');

      this.#bindEventHandlers();

      this.#hashMatcher = aiHashMatcher.create(this.#menuOpenHash);

      this.#responsiveStyleProperty = aiResponsiveStyleProperty.create(
        offCanvasStatePropertyName, this.#$sidebars,
      );

      const constructedEvent = new $.Event('OmnipediaSidebarsConstructed');

      this.#$sidebars.trigger(constructedEvent, [this]);

      /**
       * Reference to the current instance.
       *
       * @type {Sidebars}
       */
      const that = this;

      // Note that the responsive style property will not have updated yet at
      // this point, so we have to trigger an update and wait for it to
      // complete to get the current value.
      this.#responsiveStyleProperty.update().then(function() {

        // If the sidebars are off-canvas and hash matches when we construct,
        // add the open class and trigger the open event.

        if (!(
          that.isOffCanvas() === true &&
          that.#hashMatcher.matches() === true
        )) {
          return;
        }

        that.#$sidebars.addClass(sidebarsOpenClass);

        that.#$sidebars.trigger('omnipediaSidebarsMenuOpen', that);

      });

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      const beforeDestroyEvent = new $.Event('OmnipediaSidebarsBeforeDestroy');

      this.#$sidebars.trigger(beforeDestroyEvent, [this]);

      this.#unbindEventHandlers();

      this.#hashMatcher.destroy();

      this.#responsiveStyleProperty.destroy();

      const destroyedEvent = new $.Event('OmnipediaSidebarsDestroyed');

      this.#$sidebars.trigger(destroyedEvent, [this]);

      /**
       * Reference to the current instance.
       *
       * @type {Sidebars}
       */
      const that = this;

      return fastdom.mutate(function() {

        that.#$sidebars.removeClass(sidebarsOpenClass);

      })

    }

    /**
     * Validate that we've found all of the required elements.
     *
     * @throws {Error}
     *   If one or more of the elements could not be found.
     */
    #validateElements() {

      if (
        this.#$menuClose.length > 0 &&
        this.#$menuClosedAnchor.length > 0 &&
        this.#$menuClosedTarget.length > 0 &&
        this.#$menuOpen.length > 0 &&
        this.#$sidebars.length > 0
      ) {
        return;
      }

      /**
       * One or more missing element names to add to the thrown error.
       *
       * @type {String[]}
       */
      let missing = [];

      if (this.#$menuClose.length === 0) {
        missing.push('menu close');
      }

      if (this.#$menuClosedAnchor.length === 0) {
        missing.push('menu closed anchor');
      }

      if (this.#$menuClosedTarget.length === 0) {
        missing.push('menu closed target');
      }

      if (this.#$menuOpen.length === 0) {
        missing.push('menu open');
      }

      if (this.#$sidebars.length === 0) {
        missing.push('.layout-sidebars');
      }

      throw new Error(
        `Could not find one of the required elements. Missing: ${missing.join(
          ', ',
        )}`,
      );

    }

    /**
     * Bind all of our event handlers.
     *
     * @see this~#unbindEventHandlers()
     */
    #bindEventHandlers() {

      /**
       * Reference to the current instance.
       *
       * @type {Sidebars}
       */
      const that = this;

      $(document).on(`hashMatchChange.${eventNamespace}`, function(
        event, hash, matches,
      ) {

        if (hash !== that.#menuOpenHash) {
          return;
        }

        if (matches === true) {

          that.#$sidebars.addClass(sidebarsOpenClass);

          that.#$sidebars.trigger('omnipediaSidebarsMenuOpen', that);

        } else {

          that.#$sidebars.removeClass(sidebarsOpenClass);

          that.#$sidebars.trigger('omnipediaSidebarsMenuClose', that);

        }

      });

      // If the menu is open and the viewport is resized so the sidebars are no
      // longer off-canvas, close the menu so that the page isn't left in a
      // state that may make it unusable.
      this.#$sidebars.on(
        `responsivePropertyChange.${eventNamespace}`,
      function(event, instance) {

        // Ignore any other instance's events.
        if (instance.getPropertyName() !== offCanvasStatePropertyName) {
          return;
        }

        if (that.isOffCanvas() === false) {
          that.close();
        }

      });

      this.#$menuClose.on(`click.${eventNamespace}`, function(event) {

        if (that.isOffCanvas() === true) {
          that.close();
        }

        event.preventDefault();

      });

    }

    /**
     * Unbind all of our event handlers.
     *
     * @see this~#bindEventHandlers()
     */
    #unbindEventHandlers() {

      $(document).off(`hashMatchChange.${eventNamespace}`);

      this.#$sidebars.off(`responsivePropertyChange.${eventNamespace}`);

      this.#$menuClose.off(`click.${eventNamespace}`);

    }

    /**
     * Get the sidebars close element jQuery collection.
     *
     * @return {jQuery}
     */
    get $menuClose() {
      return this.#$menuClose;
    }

    /**
     * Get the sidebars closed anchor jQuery collection.
     *
     * @return {jQuery}
     */
    get $menuClosedAnchor() {
      return this.#$menuClosedAnchor;
    }

    /**
     * Get the sidebars closed target element jQuery collection.
     *
     * @return {jQuery}
     */
    get $menuClosedTarget() {
      return this.#$menuClosedTarget;
    }

    /**
     * Get the menu open element jQuery collection.
     *
     * @return {jQuery}
     */
    get $menuOpen() {
      return this.#$menuOpen;
    }

    /**
     * Get the sidebars element jQuery collection.
     *
     * @return {jQuery}
     */
    get $sidebars() {
      return this.#$sidebars;
    }

    /**
     * Whether the sidebars are currently off-canvas, i.e. on a narrow screen.
     *
     * @return {Boolean}
     */
    isOffCanvas() {

      return this.#responsiveStyleProperty.getValue() === 'true';

    }

    /**
     * Whether the off-canvas sidebars menu is currently open.
     *
     * Note that this doesn't consider whether the sidebars are actually in
     * off-canvas mode. This method should be used in conjuction with
     * this.isOffCanvas() for that purpose.
     *
     * @return {Boolean}
     *
     * @see this.isOffCanvas()
     */
    isOpen() {

      return this.#hashMatcher.matches();

    };

    /**
     * Open the menu.
     */
    open() {

      this.#hashMatcher.setActive();

    };

    /**
     * Close the menu.
     */
    close() {

      this.#hashMatcher.setInactive();

    };

  }

  this.addBehaviour(
    'OmnipediaSiteThemeSidebars',
    'omnipedia-site-theme-sidebars',
    '.layout-container',
    function(context, settings) {

      $(this).prop('OmnipediaSidebars', new Sidebars(this));

    },
    function(context, settings, trigger) {

      /**
       * Reference to the HTML element being detached from.
       *
       * @type {HTMLElement}
       */
      const that = this;

      $(this).prop('OmnipediaSidebars').destroy().then(function() {

        $(that).removeProp('OmnipediaSidebars');

      });

    }
  );


});
});
