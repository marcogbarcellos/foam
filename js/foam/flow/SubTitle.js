/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
  name: 'SubTitle',
  package: 'foam.flow',
  extendsModel: 'foam.flow.Element',

  constants: { ELEMENT: 'sub-title' },

  templates: [
    function toHTML() {/*
      <flow-sub-title id="%%id"><%= this.inner() %></flow-book-title>
    */},
    function CSS() {/*
      @media not print {

        flow-sub-title {
          margin: 10px;
          font-size: 40px;
        }

      }

      @media not print {

        flow-sub-title {
          margin-top: 0.5in;
          font-size: 24pt;
        }

      }
    */}
  ]
});
