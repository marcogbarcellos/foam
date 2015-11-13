/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO(kgr): add rotation to CView to complete demo
CLASS({
  package: 'foam.demos.modeldiagram',
  name: 'ModelDiagram',
  extends: 'foam.graphics.CView',

  requires: [
    'foam.demos.modeldiagram.Person',
    'foam.demos.supersnake.Robot',
    'foam.ui.DetailView',
    'foam.ui.TableView',
    'foam.ui.HelpView',
    'foam.ui.md.DetailView as MDDetailView',
    'foam.documentation.DocViewPicker',
    'foam.documentation.diagram.DocDiagramView',
    'foam.graphics.CView',
    'foam.graphics.ViewCView',
    'foam.graphics.LabelledBox as Box',
    'foam.util.JavaSource',
    'foam.util.swift.SwiftSource',
    'foam.graphics.Circle'
  ],

  properties: [
    [ 'width', 1200/0.75 ],
    [ 'height', 750/0.75 ]
//    [ 'scaleX', 1 ],
//    [ 'scaleY', 1 ]
//    [ 'background', 'gray' ]
  ],

  methods: {
    initCView: function() {
      var self  = this;
      var v     = this.Box.create({width: 500, height: 600, x:100, y: 145, text: 'Model', background: '#ccf', color: 'white', font: '28pt Arial'});
      var cls   = this.Box.create({width: 500, height: 600, x:800, y: 145, text: 'Class', font: '28pt Arial'});
      var robot = this.Robot.create({x:400,y:165,width:200,height:220,scaleX:0,scaleY:0});
      var display = self.ViewCView.create({
        innerView: { toHTML: function() { return '<div id="display" class="foam-demos-modeldiagram-display"></div>'; }, initHTML: function() { } },
        x: 100,
        y: 650,
        width: 1200,
        height: 740,
        background: 'pink'
      });

GLOBAL.display = display;

      this.addChildren(v, robot, cls, display);

      var M = Movement;
      var B = M.bounce(0.2, 0.08, 3);

      var anim = [
        [0],
        [500, function() { v.width /= 4.5; v.height /= 4.5; cls.alpha = 0; } ],
        [500, function() { robot.scaleX = robot.scaleY = 3; } ],
        [0]
      ];

      var fnum = 0;
      function feature(f, anim, xo, yo, timeWarp) {
        var factory = f.factory;
        var pause   = f.factory || f.pause;

        timeWarp = timeWarp || 1;
        var b = self.Box.create({width: v.width/5+15, height: v.height/5, x: robot.x, y: v.y, text: f.name, font: '14pt Arial'});
        var num = fnum++;
        var x = num % 5;
        var y = Math.floor(num/5);

//        if ( f.pause ) anim.push([[0]]);
        anim.push(function() { self.addChild(b); });
//        anim.push([100*timeWarp, function() { b.x = robot.x; }]);
//        anim.push(function() { b.background = 'white'; });
        if ( pause ) {
          if ( f.factory ) anim.push(function() { self.setDisplay(factory); });
          anim.push([400*timeWarp, function() { b.x += 250; b.y-=80; b.scaleX = b.scaleY = 3; }]);
          anim.push([[0]]);
          if ( factory ) anim.push(function() { self.setDisplay(); });
          anim.push([200*timeWarp, function() { b.scaleX = b.scaleY = 1; b.x += xo + x * b.width*1.4; b.y += yo + b.height*1.2 * y; }]);
        } else {
          anim.push([600*timeWarp, function() { b.x += 250 + xo + x * b.width*1.4; b.y += yo + b.height*1.2 * y - 80; }]);
        }
      }

      var p = this.Person.create({
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        age: 42,
        married: true
      });
      var people = [
        p,
        this.Person.create({id: 2, firstName: 'Janet', lastName: 'Jones', age: 38, married: true}),
        this.Person.create({id: 2, firstName: 'Jimmy', lastName: 'Jones', age: 8, married: false})      ];
      GLOBAL.p = p;

      var fs = [
        { name: 'Class', pause: true, factory: multiline(function() {/*
var p = this.Person.create({
   id: 1,
   firstName: 'John',
   lastName: 'Smith',
   age: 42,
   married: true
});
        */}) },
        { name: '.hashCode()', factory: multiline(function() {/*
> p.hashCode();
< 343020328
> p.firstName = 'Steve';
< "Steve"
> p.hashCode();
< 1609175968
*/}) },
        { name: '.copyFrom()' },
        { name: '.clone()' },
        { name: '.equals()' },
        { name: '.compareTo()' },
        { name: 'Observer' },
        { name: 'XML', factory: multiline(function() {/*
> p.toXML();
< "<foam>
<object model="Person">
  <property name="id">1</property>
  <property name="firstName">John</property>
  <property name="lastName">Smith</property>
  <property name="age">42</property>
  <property name="married">true</property>
</object>
</foam>"
*/}) },
        { name: 'JSON',  factory: multiline(function() {/*
> p.toJSON();"
< "{
   "model_": "foam.demos.modeldiagram.Person",
   "id": 1,
   "firstName": "John",
   "lastName": "Smith",
   "age": 42,
   "married": true
}"*/})  },
        { name: 'Detail View', factory: function() { return self.DetailView.create({data:p}); /**/ } },
        { name: 'MD View', factory: function() { return self.MDDetailView.create({data:p}); /**/ } },
        { name: 'Table View', factory: function() { return self.TableView.create({model:self.Person, dao: people}); /**/ } },
        { name: 'List View' },
        { name: 'Help View', factory: function() { return self.HelpView.create({model:Model}); /**/ } },
        { name: 'Grid View', factory: function() { return { toHTML: function() { return '<img class="shadow0515" style="border:1px solid;max-height:510px" width="45%" src="./js/foam/demos/modeldiagram/WarpedGrid.png">'; }, initHTML: function() { }}; } },
        { name: 'Query' },
        { name: 'Local Store' },
        { name: 'IndexedDB' },
        { name: 'ClientDAO' },
        { name: 'ServerDAO' },
        { name: 'Offline' },
        { name: 'FileDAO' },
        { name: 'MongoDB' },
        { name: 'Postgres' },
        { name: 'Cloud Store' },
        { name: 'Firebase' },
        { name: 'Controller', factory: function() { return { toHTML: function() { return '<img class="shadow0515" height="65%" style="margin-left: 100px;border:1px solid;max-height:510px" src="./demos/democat/GMail.png">'; }, initHTML: function() { }}; } },
        { name: 'UML', factory: function() { return self.DocDiagramView.create({data:self.Person}); }},
//        { name: 'Docs', factory: function() { return self.DocViewPicker.create({data:self.Person}); }},
        { name: '...' },
        { name: '...' }
      ];

      // JS
      fs.forEach(function(f) { feature(f, anim, 0, 0); });

      // Java
      anim.push([0]);
      fs.forEach(function(f) { f.factory = false; f.pause = false; });
      fs[0].factory = self.JavaSource.create().generate(self.Person);
      anim.push([500, function() { self.scaleX = self.scaleY = 0.7; }]);
      fnum = 0;
      fs.forEach(function(f) { feature(f, anim, 900, 0, 0.2); });

      // Swift
      anim.push([0]);
      fs[0].factory = self.SwiftSource.create().generate(self.Person);
      anim.push([500, function() { self.scaleX = self.scaleY = 0.7 * 0.7; }]);
      fnum = 0;
      fs.forEach(function(f) { feature(f, anim, 1800, 0, 0.2); });

      // Other
      anim.push([0]);
      fs.forEach(function(f) { f.factory = false; f.pause = false; });
      fnum = 0;
      fs.forEach(function(f) { feature(f, anim, 0, 1000, 0.2); });

      // Your Stack Here
      anim.push([0]);
      var ys1 = self.Box.create({x: 1550, y: 1060, width: 660, height: 850, scaleX: 0, scaleY: 0, font: '50pt Arial', text: 'Your Stack Here'});
      var ys2 = self.Box.create({x: 1550, y: 1060, width: 0, height: 0, font: '50pt Arial'});
      var ys3 = self.Box.create({x: 1550, y: 1060, width: 0, height: 0, font: '50pt Arial'});
      var ys4 = self.Box.create({x: 1550, y: 1060, width: 0, height: 0, font: '50pt Arial'});
      this.addChildren(ys4, ys3, ys2, ys1);
      anim.push([300, function() { ys1.scaleX = ys1.scaleY = 1; }]);
      anim.push([300, function() { ys2.width = 660; ys2.height = 850; ys2.x += 40; ys2.y-=40;}]);
      anim.push([300, function() { ys3.width = 660; ys3.height = 850; ys3.x += 80; ys3.y-=80;}]);
      anim.push([300, function() { ys4.width = 660; ys4.height = 850; ys4.x += 120; ys4.y-=120;}]);

      anim.push([0]);
//      anim.push([500, function() { self.scaleX = self.scaleY = 1; }]);

      M.compile(anim)();
    },
    setDisplay: function(txt) {
      if ( typeof txt === 'function' ) {
        var v = txt();
        this.X.$('display').innerHTML = v.toHTML();
        v.initHTML();
      } else {
        this.X.$('display').innerHTML = txt ? '<textarea style="font-size:24px" rows="16" cols="77">' + txt + '</textarea>' : '';
      }
    }
  }
});
