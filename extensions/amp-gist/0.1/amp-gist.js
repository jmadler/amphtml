/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {getIframe, listen} from '../../../src/3p-frame';
import {isLayoutSizeDefined} from '../../../src/layout';
import {loadPromise} from '../../../src/event-helper';
import {assertHttpsUrl} from '../../../src/url';


class AmpGist extends AMP.BaseElement {
  /** @override */
  createdCallback() {
    this.preconnect.url('https://gist.github.com');
  }

  /** @override */
  isLayoutSupported(layout) {
    return isLayoutSizeDefined(layout);
  }

  /** @override */
  layoutCallback() {
    var src = AMP.assert(
        (this.element.getAttribute('data-src') ||
        this.element.getAttribute('src')),
        'The data-src attribute is required for <amp-gist> %s',
        this.element);
// TODO: must be github, must end in .js
    assertHttpsUrl(src, 'amp-gist');
    this.element.src = '#';
    var iframe = getIframe(this.element.ownerDocument.defaultView,
        this.element, 'github');
    this.applyFillContent(iframe);
    this.element.appendChild(iframe);
    // Triggered by context.updateDimensions() inside the iframe.
    listen(iframe, 'embed-size', data => {
      iframe.contentWindow.document.body.innerHTML = '<script src="' + src + '"></script>';
      iframe.height = data.height;
      iframe.width = data.width;
      var amp = iframe.parentElement;
      amp.setAttribute('height', data.height);
      amp.setAttribute('width', data.width);
      this.changeHeight(data.height);
    });
    return loadPromise(iframe);
  }
};

AMP.registerElement('amp-gist', AmpGist);
