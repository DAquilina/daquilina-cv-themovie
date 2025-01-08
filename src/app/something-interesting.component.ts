import {
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { CommonModule } from '@angular/common';

enum CutsceneStepType {
  Complete = 'COMPLETE',
  Delay = 'DELAY',
  Dialogue = 'DIALOGUE',
  Reset = 'RESET',
  SetValue = 'SET_VALUE',
}

enum Speaker {
  Engineer = 'ENGINEER',
  Mother = "MANAGER'S MOM",
  Manager = 'MANAGER',
}

type ActiveCutscene = {
  currentStep: number;
  cutscene: Cutscene;
};

type ActiveDialogue = {
  items: Array<DialogueTemplateConfig>;
};

type Cutscene = {
  steps: Array<CutsceneStep>;
};

type CutsceneStep = {
  actions?:
    | CutsceneStepActions__Delay
    | CutsceneStepActions__Dialogue
    | CutsceneStepActions__SetValue;
  automaticallyProceed: boolean;
  skippable: boolean;
  type: CutsceneStepType;
};

type CutsceneStepActions__Delay = {
  duration: number;
};

type CutsceneStepActions__Dialogue = {
  dialogue: DialogueConfig;
};

type CutsceneStepActions__SetValue = {
  values: Map<string, unknown>;
};

type DialogueConfig = {
  left: boolean;
  speaker: Speaker;
  text: string;
};

type DialogueTemplateConfig = {
  id: string;
  data: DialogueConfig;
};

const CUTSCENES: { [key: string]: Cutscene } = {
  contact: {
    steps: [
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'So what do you say? I think we should definitely follow up.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: "I think he's got the experience, technical knowledge, and professionalism to really benefit this company. You take a look through his GitHub, and I'll shoot him an email.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Mother,
            text: 'I like him too!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'Thanks, Mrs. M!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'MOOOOM!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        automaticallyProceed: false,
        skippable: false,
        type: CutsceneStepType.Complete,
      },
    ],
  },
  education: {
    steps: [
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: "Oh, University of Waterloo! I've heard that's a really good engineering school. Did you know—",
          },
        },
        automaticallyProceed: true,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Mother,
            text: 'Manager, dear!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'Ugh, moooom!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Mother,
            text: 'Manager, sweetheart, can you hear me?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: "Mom, I told you not to bother me while I'm working!",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Mother,
            text: 'Manager, would you or your friend like a tuna fish sandwich?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'No thank you mom, we would not like a tuna fish sandwich. Go back to your stories.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Mother,
            text: 'Okay dear, have fun with your friend!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'Mooooooooooooooooooom!',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          duration: 1000,
        },
        automaticallyProceed: true,
        skippable: true,
        type: CutsceneStepType.Delay,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: '...',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: '...',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'What?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: "Dude, I've got so many questions.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: "Let's not and say we didn't.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: "Why does she call you 'Manager'?",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'Can we just—',
          },
        },
        automaticallyProceed: true,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'Also, why did you say no? I could go for some tuna.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: '...',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: false,
        skippable: false,
        type: CutsceneStepType.Complete,
      },
    ],
  },
  init: {
    steps: [
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'So who is this guy again?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: "Dominic Aquilina. \"Your next best front-end engineer.\" That's a bit bold. I guess it's cool that he made his CV into a website, but we'll see if he can back it up.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: "Well then, what are we waiting for? Let's boot the sucker up.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          values: new Map<string, unknown>([['isMonitorOn', true]]),
        },
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.SetValue,
      },
      {
        actions: {
          duration: 1000,
        },
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Delay,
      },
      {
        actions: {
          values: new Map<string, unknown>([['showCVLoadingAnimation', true]]),
        },
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.SetValue,
      },
      {
        actions: {
          duration: 1000,
        },
        automaticallyProceed: true,
        skippable: true,
        type: CutsceneStepType.Delay,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'Remind me, why are we doing this in your basement? Also, why the heck do you have dial-up?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'Because the office has a COVID outbreak. And my files are here.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'I would risk death to regain access to that fibre connection. This... This is torture.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          duration: 2000,
        },
        automaticallyProceed: true,
        skippable: true,
        type: CutsceneStepType.Delay,
      },
      {
        actions: {
          values: new Map<string, unknown>([
            ['showCVLoadingAnimation', false],
            ['showCVContent', true],
          ]),
        },
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.SetValue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'Finally.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          duration: 1000,
        },
        automaticallyProceed: true,
        skippable: true,
        type: CutsceneStepType.Delay,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: '"I Build Experiences"',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: "That's pretty catchy as slogans go. You don't usually see an engineer with a servicable tagline.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: 'Excuse you.',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        automaticallyProceed: false,
        skippable: false,
        type: CutsceneStepType.Complete,
      },
    ],
  },
  workHistory: {
    steps: [
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: "I'm seeing a good breadth of experience here. Supply chain management, big data, ad tech, ag tech... This guy has been around.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'Is he one of those people who will just jump to the next big thing, you think?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: "Are you kidding? He worked at Shopliftr for like 5 years. When's the last time you met a developer who stayed at one company for that long?",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        actions: {
          dialogue: {
            left: true,
            speaker: Speaker.Manager,
            text: 'Fair enough. How is he with our stack?',
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        actions: {
          dialogue: {
            left: false,
            speaker: Speaker.Engineer,
            text: "LOTS of Angular, so we're definitely good there, but honestly the specific languages don't matter that much. We can train anyone if they have the right mindset, and it looks like he's had his hands in pretty much everything.",
          },
        },
        automaticallyProceed: false,
        skippable: true,
        type: CutsceneStepType.Dialogue,
      },
      {
        automaticallyProceed: true,
        skippable: false,
        type: CutsceneStepType.Reset,
      },
      {
        automaticallyProceed: false,
        skippable: false,
        type: CutsceneStepType.Complete,
      },
    ],
  },
};

const ID_SET = 'abcdefghijklmnopqrstuvwxyz1234567890';

@Component({
  standalone: true,
  selector: 'app-something-interesting',
  imports: [CommonModule],
  animations: [
    trigger('dialogueItemAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0%)' }),
        animate('200ms', style({ transform: 'scale(110%)' })),
        animate('100ms', style({ transform: 'scale(90%)' })),
        animate('100ms', style({ transform: 'scale(100%)' })),
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'scale(0%)' })),
      ]),
    ]),
  ],
  template: `
    <div class="eternal-darkness">
      <div class="monitor-container">
        <div class="monitor-bezel-outer" [style.height]="monitorHeightString">
          <div class="monitor-bezel-inner">
            <div class="monitor-screen" [class.on]="isMonitorOn" [class.paused]="isCutsceneRunning">
              <div class="website-content">
                <div *ngIf="showCVLoadingAnimation" class="cv-loading-wrapper">
                  <div class="cv-loading-block">
                    <p class="cv-loading-text">
                      LOADING
                    </p>
                    <div class="cv-loading-bar">
                      <span class="cv-loading-bar-element"></span>
                      <span class="cv-loading-bar-element"></span>
                      <span class="cv-loading-bar-element"></span>
                      <span class="cv-loading-bar-element"></span>
                      <span class="cv-loading-bar-element"></span>
                      <span class="cv-loading-bar-element"></span>
                      <div class="cv-loading-bar-cover"></div>
                    </div>
                  </div>
                </div>

                <div *ngIf="showCVContent" class="cv-content-wrapper">
                  <h1 class="cv-heading">
                    Hi, I'm Dominic Aquilina
                  </h1>

                  <p class="cv-tagline">
                    I build experiences.
                  </p>

                  <hr />

                  <div class="cv-section-wrapper clickable" (click)="triggerCutscene(CUTSCENES.workHistory)">
                    <h2 class="cv-subheading">
                      Work History
                    </h2>

                    <div class="cv-section work-history">
                      <div class="work-history-item">
                        <h3 class="work-history-company">Kinaxis</h3>

                        <div class="work-history-blurb"></div>
                      </div>
                      
                      <div class="work-history-item">
                        <h3 class="work-history-company">Cinchy</h3>

                        <div class="work-history-blurb"></div>
                      </div>
                      
                      <div class="work-history-item">
                        <h3 class="work-history-company">Shopliftr</h3>

                        <div class="work-history-blurb"></div>
                      </div>

                      <div class="work-history-item">
                        <h3 class="work-history-company">Local Line</h3>

                        <div class="work-history-blurb"></div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div class="cv-section-wrapper clickable" (click)="triggerCutscene(CUTSCENES.education)">
                    <h2 class="cv-subheading">
                      Education
                    </h2>

                    <div class="cv-section">
                      <p class="education-item">
                        University of Waterloo, BaSC in Computer Engineering, Honours, Co-op
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div class="cv-section-wrapper clickable" (click)="triggerCutscene(CUTSCENES.contact)">
                    <h2 class="cv-subheading">
                      Contact
                    </h2>

                    <div class="cv-section contact">
                      <div class="contact-icon-wrapper">
                        <a href="mailto:aquilina.dominic@gmail.com" target="_blank" class="contact-icon email"><img src="https://i.imgur.com/wnLTaN7.png" alt="send an email" /></a>
                      </div>

                      <div class="contact-icon-wrapper">
                        <a href="https://github.com/DAquilina" target="_blank" class="contact-icon github"><img src="https://i.imgur.com/3DzP9MG.png" alt="find me on GitHub" /></a>
                      </div>

                      <div class="contact-icon-wrapper">
                        <a href="tel:+16138689142" class="contact-icon phone"><img src="https://i.imgur.com/i5WtEtX.png" target="_blank" alt="call me, beep me, if you wanna reach me" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span class="monitor-logo">DA</span>
        </div>
      </div>

      <div class="dialogue-wrapper" [style.height]="monitorHeightString" [style.zIndex]="dialoguePriority">
        <ng-template #dialogueItemTemplate let-item="item">
          <div  @dialogueItemAnimation class="dialogue-item {{cssify(item.data.speaker)}} {{item.data.left ? 'left' : 'right'}}">
            <div class="dialogue-tail">
              <div class="dialogue-tail-inner"></div>
            </div>
            <div class="dialogue-text-container">
              <span class="dialogue-speaker">{{item.data.speaker}}</span>
              <span id="{{item.id}}" class="dialogue-text"></span>
              <button id="{{getProceedButtonId(item.id)}}"
                type="button"
                class="dialogue-proceed-button clickable"
                [class.disabled]="isDialogueRunning"
                (click)="proceed()"
              >
                &gt;
              </button>
            </div>
          </div>
        </ng-template>

        @for (item of activeDialogue?.items; track item) {
          <ng-container
            [ngTemplateOutlet]="dialogueItemTemplate"
            [ngTemplateOutletContext]="{ item: item }"
          >
          </ng-container>
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* ***** ANIMATIONS ***** */
      @keyframes powerOnMonitor {
        0% {
          height: 1px;
          width: 30%;
        }
        40% {
          height: 1px;
          width: 100%;
        }
        100% {
          height: 100%;
          width: 100%;
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1.0);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1.0);
        }
      }

      @keyframes unveil {
        0% {
          left: 0%;
        }
        17% {
          left: 17%;
        }
        33% {
          left: 33%;
        }
        50% {
          left: 50%;
        }
        67% {
          left: 67%;
        }
        84% {
          left: 84%;
        }
        100% {
          left: 100%;
        }
      }

      /* ***** BASE STYLES ***** */
      :host {
        --color-engineer: #099696;
        --color-manager: #BF1767;
        --color-mother: #782c6d;
        
        --color-text: #0B0B0B;
        --color-text-light: #FFFFFF;
        
        --color-bg-void: #1B1B1B;
        --color-bg-hover: rgba(0, 0, 0, 0.15);
        --color-bg-light: #FFFFFF;
        --color-bg-bezel: #beb8aa;

        --color-border: #1B1B1B;
        --color-border-light: #FFFFFF;

        --border-radius: 10px;
        --border-radius-sm: 5px;
        --border-radius-full: 100%;

        --spacing: 1rem;
        --spacing-sm: 0.5rem;

        --crt-max-width: 1024px;
        --bezel-width: 50px;

        --dialogue-max-width: 1152px;
        // Note: this is half of the desired height because of the method used to render the triangle
        --dialogue-tail-height: 10px;
        --dialogue-tail-width: 30px;

        --cv-section-max-width: 650px;

        --icon-size: 32px;
      }
      
      hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: var(--spacing) auto;
        width: 65%;
      }

      .clickable {
        cursor: pointer;
      }

      .clickable:active,
      .clickable:focus,
      .clickable:hover {
        background-color: var(--color-bg-hover) !important;

        transition: background-color 0.3s ease;
      }

      .eternal-darkness {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;

        background-color: var(--color-bg-void);
      }

      .paused * {
        pointer-events: none;
      }

      .website-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;

        color: var(--color-text);
      }

      /* ***** CV ***** */
      .cv-content-wrapper {
        height: 100%;
        overflow-y: auto;
        padding: var(--spacing);
        text-align: center;
        width: 100%;
      }

      .cv-content-wrapper .cv-heading {
        font-size: 18px;
      }

      .cv-content-wrapper .cv-tagline {
        font-size: 12px;
      }

      .cv-content-wrapper .cv-subheading {
        font-size: 14px;
      }

      .cv-loading-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }

      .cv-loading-wrapper .cv-loading-block {
        position: absolute;
        left: 50%;
        top: 50%;

        width: 50%;

        transform: translate(-50%, -50%);
      }

      .cv-loading-wrapper .cv-loading-text {
        text-align: center;
        width: 100%;
      }

      .cv-loading-wrapper .cv-loading-bar {
        position: relative;

        border: 1px solid var(--color-border);
        display: flex;
        gap: 5px;
        justify-items: space-between;
        padding: 3px;
        width: 100%;
      }

      .cv-loading-wrapper .cv-loading-bar-element {
        background-color: var(--color-text);
        display: inline-block;
        flex-basis: 100%;
        height: 10px;
      }

      .cv-loading-wrapper .cv-loading-bar-cover {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;

        background-color: var(--color-bg-light);

        animation: unveil 7s infinite;
      }

      .cv-section-wrapper {
        margin: 0 auto;
        padding: var(--spacing);
        max-width: var(--cv-section-max-width);
      }

      .cv-section.contact {
        display: flex;
      }

      .cv-section .contact-icon-wrapper {
        flex-basis: 33%;
        text-align: center;
      }

      .cv-section .contact-icon {
        border-radius: var(--border-radius-full);
        display: inline-block;
        padding: var(--spacing-sm);
        transition: transform 0.3s ease, background-color 0.3s ease;

        transform: scale(1.0);
      }

      .cv-section .contact-icon:active,
      .cv-section .contact-icon:focus,
      .cv-section .contact-icon:hover {
        transform: scale(1.4);
      }

      .cv-section .contact-icon.email:active,
      .cv-section .contact-icon.email:focus,
      .cv-section .contact-icon.email:hover {
        background-color: var(--color-mother);
      }

      .cv-section .contact-icon.github:active,
      .cv-section .contact-icon.github:focus,
      .cv-section .contact-icon.github:hover {
        background-color: var(--color-engineer);
      }

      .cv-section .contact-icon.phone:active,
      .cv-section .contact-icon.phone:focus,
      .cv-section .contact-icon.phone:hover {
        background-color: var(--color-manager);
      }

      .cv-section .contact-icon > img {
        height: var(--icon-size);
        vertical-align: middle;
        width: var(--icon-size);
      }

      .cv-section .education-item,
      .cv-section .work-history-item {
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-sm);
        margin-bottom: var(--spacing);
        padding: var(--spacing-sm);
      }

      .cv-section .work-history-item {
        text-align: left;
      }

      .cv-section .work-history-item:last-child {
        margin-bottom: 0;
      }

      .cv-section .work-history-company {
        position: relative;

        font-size: 14px;
        margin: 0;
      }

      .cv-section .work-history-company::after {
        position: absolute;
        bottom: 25%;
        right: 0;
        top: 25%;
        
        background-color: #999;
        content: " ";
        width: min(25%, 200px);
      }

      .cv-section .work-history-blurb {
        background-color: #999;
        height: 100px;
        margin-top: var(--spacing-sm);
        width: 100%;
      }

      /* ***** DIALOGUE ***** */
      .dialogue-wrapper {
        position: relative;
        top: 50%;

        align-items: end;
        display: flex;
        margin: 0 auto;
        max-width: var(--dialogue-max-width);
        flex-direction: column;

        transform: translateY(-50%);
      }

      .dialogue-wrapper .dialogue-item {
        position: relative;

        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing);
        padding: var(--spacing);
        width: 90%;
      }

      .dialogue-wrapper .dialogue-item::before {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;

        border: var(--spacing-sm) solid var(--color-border-light);
        border-radius: var( --border-radius);
        content: " ";
        z-index: 0;
      }

      .dialogue-wrapper .dialogue-item:last-child {
        margin-bottom: 0;
      }

      .dialogue-wrapper .dialogue-item.engineer {
        background-color: var(--color-engineer);
      }

      .dialogue-wrapper .dialogue-item.left {
        align-self: start;
      }

      .dialogue-wrapper .dialogue-item.manager {
        background-color: var(--color-manager);
      }

      .dialogue-wrapper .dialogue-item.managersmom {
        background-color: var(--color-mother);
      }

      .dialogue-wrapper .dialogue-tail {
        position: absolute;
        left: calc(-1 * var(--dialogue-tail-width));
        right: auto;
        top: var(--spacing-sm);

        border-style: solid;
        border-width: var(--dialogue-tail-height) var(--dialogue-tail-width) var(--dialogue-tail-height) 0;
        border-color: transparent var(--color-border-light) transparent transparent;
        box-sizing: border-box;
      }

      .dialogue-wrapper .dialogue-tail::before {
        position: absolute;
        left: -2px;
        right: auto;
        top: calc(-1 * var(--spacing-sm) - 3px);

        border-style: solid;
        border-width: calc(var(--dialogue-tail-height) + 1px) calc(var(--dialogue-tail-width) + 2px) calc(var(--dialogue-tail-height) + 1px) 0;
        border-color: transparent var(--color-border) transparent transparent;
        box-sizing: border-box;
        content: " ";
        z-index: -1;
      }

      .dialogue-wrapper .left .dialogue-tail {
        left: auto;
        right: calc(-1 * var(--dialogue-tail-width));

        border-width: var(--dialogue-tail-height) 0 var(--dialogue-tail-height) var(--dialogue-tail-width);
        border-color: transparent transparent transparent var(--color-border-light);
      }

      .dialogue-wrapper .left .dialogue-tail::before {
        left: auto;
        right: -2px;

        border-width: calc(var(--dialogue-tail-height) + 1px) 0 calc(var(--dialogue-tail-height) + 1px) calc(var(--dialogue-tail-width) + 2px);
        border-color: transparent transparent transparent var(--color-border);
      }

      .dialogue-wrapper .dialogue-tail-inner {
        position: absolute;
        left: var(--spacing);
        right: auto;
        top: -10px;

        border-style: solid;
      }

      .dialogue-wrapper .left .dialogue-tail-inner {
        position: absolute;
        left: auto;
        right: var(--spacing);

        border-style: solid;
      }

      .dialogue-wrapper .engineer .dialogue-tail-inner {
        border-width: 10px var(--dialogue-tail-width) 10px 0;
        border-color: transparent var(--color-engineer) transparent transparent;
      }

      .dialogue-wrapper .engineer.left .dialogue-tail-inner {
        border-width: 10px 0 10px var(--dialogue-tail-width);
        border-color: transparent transparent transparent var(--color-engineer);
      }

      .dialogue-wrapper .manager .dialogue-tail-inner {
        border-width: 10px var(--dialogue-tail-width) 10px 0;
        border-color: transparent var(--color-manager) transparent transparent;
      }

      .dialogue-wrapper .manager.left .dialogue-tail-inner {
        border-width: 10px 0 10px var(--dialogue-tail-width);
        border-color: transparent transparent transparent var(--color-manager);
      }

      .dialogue-wrapper .managersmom .dialogue-tail-inner {
        border-width: 10px var(--dialogue-tail-width) 10px 0;
        border-color: transparent var(--color-mother) transparent transparent;
      }

      .dialogue-wrapper .managersmom.left .dialogue-tail-inner {
        border-width: 10px 0 10px var(--dialogue-tail-width);
        border-color: transparent transparent transparent var(--color-mother);
      }

      .dialogue-wrapper .dialogue-speaker {
        font-size: 10px;
        margin-bottom: 0.25rem;
      }

      .dialogue-wrapper .dialogue-text-container {
        position: relative;

        align-items: start;
        color: var(--color-text-light);
        display: flex;
        flex-direction: column;
        font-family: Andale Mono, AndaleMono, monospace;
        z-index: 1;
      }

      .dialogue-wrapper .dialogue-text {
        font-size: 12px;
      }

      .dialogue-wrapper .left .dialogue-text {
        align-self: start;
      }

      .dialogue-wrapper .dialogue-proceed-button {
        align-self: end;
        background: rgba(0, 0, 0, 0);
        border: none;
        border-radius: var(--border-radius-full);
        color: var(--color-text-light);
        display: inline-block;
        font-family: Andale Mono, AndaleMono, monospace;
        height: 25px;
        margin-top: var(--spacing-sm);
        text-align: center;
        transition: background-color 0.3s ease;
        width: 25px;

        animation: pulse 1s infinite;
      }

      .dialogue-wrapper .dialogue-proceed-button.disabled {
        opacity: 0.5;
        pointer-events: none;

        animation: none;
      }

      .monitor-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;

        z-index: 1;
      }

      /* ***** MONITOR ***** */
      .monitor-container .monitor-bezel-outer {
        position: relative;
        left: 50%;
        top: 50%;

        background-color: var(--color-bg-bezel);
        border-radius: var(--border-radius-sm);
        max-width: var(--crt-max-width);
        width: 80%;

        transform: translate(-50%, -50%);
      }

      .monitor-container .monitor-logo {
        position: absolute;
        bottom: calc(var(--bezel-width) / 2);
        left: 50%;

        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-full);
        padding: var(--spacing-sm);

        transform: translate(-50%, 50%);
      }

      .monitor-container .monitor-bezel-inner {
        position: absolute;
        bottom: var(--bezel-width);
        left: var(--bezel-width);
        right: var(--bezel-width);
        top: var(--bezel-width);

        align-items: center;
        background-color: var(--color-bg-void);
        border-radius: var(--border-radius-sm);
        justify-content: center;
        display: flex;
        overflow: hidden;
      }

      .monitor-container .monitor-screen {
        background-color: var(--color-bg-light);
        display: none;
        height: 1px;
        width: 30%;
      }

      .monitor-container .monitor-screen.on {
        animation: powerOnMonitor 1s 1;
        background-color: var(--color-bg-light);
        display: var(--color-void);
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class SomethingInterestingComponent implements OnDestroy, OnInit {
  /**
   * Pressing enter will either proceed past a completed dialogue box (if otherwise unskippable) or proceed immediately if the current step is skippable
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      event.key === 'Enter' &&
      (this.activeCutscene?.cutscene.steps[this.activeCutscene?.currentStep]
        .skippable ||
        (this.isCurrentStepDialogue && !this.isDialogueRunning))
    ) {
      if (this.isCurrentStepDelay) {
        clearTimeout(this.activeDelay);
      }

      this.proceed();
    }
  }

  activeCutscene: ActiveCutscene;

  activeDelay: ReturnType<typeof setTimeout>;

  activeDialogue: ActiveDialogue = {
    items: new Array<DialogueTemplateConfig>(),
  };

  /**
   * This is specifically referring to the "typing" effect as a single dialogue box renders its message. This state is distinct from whether
   * or not there are dialogue boxes currently on-screen.
   */
  isDialogueRunning = false;

  isMonitorOn = false;

  isSiteLoaded = false;

  monitorHeight: number = 768;

  monitorObserver: ResizeObserver;

  showCVContent = false;

  showCVLoadingAnimation = false;

  /**
   * I wanted to define this outside of the component so it wouldn't get in the way of other things while I was working on both the scenes and
   * the functionality simulatenously, but that means I need to use this pattern in order to access the keys in the template. I'd rather do
   * this than type out the values, so enjoy this nonsensical pattern.
   */
  CUTSCENES = CUTSCENES;

  get dialoguePriority(): string {
    return this.isCurrentStepDialogue ? '10' : '-1';
  }

  get isCurrentStepDialogue(): boolean {
    return Boolean(
      this.activeCutscene?.cutscene.steps[this.activeCutscene.currentStep]
        ?.type === CutsceneStepType.Dialogue
    );
  }

  get isCurrentStepDelay(): boolean {
    return Boolean(
      this.activeCutscene?.cutscene.steps[this.activeCutscene.currentStep]
        ?.type === CutsceneStepType.Delay
    );
  }

  get isCutsceneRunning(): boolean {
    return !!this.activeCutscene;
  }

  get monitorHeightString(): string {
    return `${this.monitorHeight}px`;
  }

  constructor(private _zone: NgZone) {
    this._doSomethingInteresting();
  }

  ngOnDestroy() {
    // This might not actually be necessary, but I'm not 100% when the resources for this are destroyed relative to when the view changes
    this.monitorObserver.disconnect();
  }

  ngOnInit() {
    // Resets the monitor and dialogue container heights when the screen is resized. This maintains the desired 4:3 aspect ratio
    this.monitorObserver = new ResizeObserver((entries) => {
      this._zone.run(() => {
        this.monitorHeight = entries[0].contentRect.width * 0.75;
      });
    });

    this.monitorObserver.observe(
      document.querySelector('.monitor-bezel-outer')
    );
  }

  /**
   * Encodes the given speaker into a css class
   */
  cssify(speaker: Speaker): string {
    return speaker.toLowerCase().replaceAll(/[,'\-_\s]/gi, '');
  }

  /**
   * Generates ID text for the proceed button on the same dialogue box as the given text container
   */
  getProceedButtonId(textContainerId: string): string {
    return `proceed-button-${textContainerId}`;
  }

  /**
   * Moves to the next step in the active cutscene
   */
  proceed(): void {
    if (this.activeCutscene) {
      if (this.isCurrentStepDialogue) {
        document
          .getElementById(
            this.getProceedButtonId(
              this.activeDialogue.items[this.activeDialogue.items.length - 1].id
            )
          )
          .classList.add('hidden');
      }

      this.activeCutscene.currentStep++;

      this._executeCutsceneStepAndProceed(
        this.activeCutscene.cutscene.steps[this.activeCutscene.currentStep]
      );
    }
  }

  /**
   * Kicks off the given cutscene by running the first step and storing its reference
   */
  triggerCutscene(cutscene: Cutscene): void {
    if (!this.activeCutscene) {
      this.activeCutscene = { cutscene: cutscene, currentStep: 0 };

      this._executeCutsceneStepAndProceed(
        this.activeCutscene.cutscene.steps[this.activeCutscene.currentStep]
      );
    }
  }

  /**
   * Sets all variables keyed in the map to their respective configured value
   */
  private _doSetValue(values: Map<string, unknown>): void {
    values.forEach((value: unknown, key: string) => {
      this[key] = value as any;
    });
  }

  /**
   * Ask and ye shall receive! Is this interesting enough?
   */
  private _doSomethingInteresting() {
    this.triggerCutscene(CUTSCENES.init);
  }

  /**
   * Asynchronously executes the given cutscene step, resolving the appropriate effect based on the step's configuration
   */
  private _executeCutsceneStep(step: CutsceneStep): Promise<void> {
    return new Promise(async (resolve, reject) => {
      switch (step.type) {
        case CutsceneStepType.Complete:
          this.activeCutscene = undefined;

        // falls through
        case CutsceneStepType.Reset:
          this._resetDialogue();

          await this._sleep(300);

          resolve();

          break;
        case CutsceneStepType.Delay:
          this.activeDelay = setTimeout(() => {
            resolve();
          }, (step.actions as CutsceneStepActions__Delay).duration);

          break;
        case CutsceneStepType.Dialogue:
          const dialogueTemplate: DialogueTemplateConfig = {
            id: this._generateId(),
            data: (step.actions as CutsceneStepActions__Dialogue).dialogue,
          };

          this.activeDialogue.items.push(dialogueTemplate);

          setTimeout(() => {
            this._executeDialogue(
              dialogueTemplate.data.text,
              dialogueTemplate.id
            )
              .then(() => {
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          }, 1);

          break;
        case CutsceneStepType.SetValue:
          this._doSetValue(
            (step.actions as CutsceneStepActions__SetValue).values
          );

          resolve();

          break;

        // Troubleshooting note: there's no call to resolve if the case isn't
        // explicitly handled above, so if the promise isn't returning it could
        // be that the type isn't correctly set or accounted for, or it could
        // be an issue in one of the asynchronous processes
      }
    });
  }

  /**
   * Wrapper to allow for steps to proceed automatically
   */
  private _executeCutsceneStepAndProceed(step: CutsceneStep): void {
    this._executeCutsceneStep(step).then(() => {
      if (step.automaticallyProceed) {
        this.proceed();
      }
    });
  }

  /**
   * Causes the given text to asynchronously render in the target dialogue box letter by letter
   */
  private _executeDialogue(
    text: string,
    textContainerId: string
  ): Promise<void> {
    return new Promise(async (resolve) => {
      this.isDialogueRunning = true;

      const container = document.getElementById(textContainerId);

      const letters = text.split('');

      for (let index = 0; index < letters.length; index++) {
        container.innerHTML += letters[index];

        await this._sleep(20);
      }

      this.isDialogueRunning = false;

      resolve();
    });
  }

  /**
   * Generates a unique ID for a dialogue text container.
   *
   * I would use a UUID here, but I didn't want to introduce another dependency,
   * so instead I'm just leveraging the obviously-flawed Math.Random and hoping
   * you don't get a duplicate while testing this
   */
  private _generateId(): string {
    let output = '';

    for (let index = 0; index < 30; index++) {
      output += ID_SET[Math.floor(Math.random() * ID_SET.length)];
    }

    return output;
  }

  /**
   * Clears any active dialogue items
   */
  private _resetDialogue(): void {
    this.activeDialogue.items = new Array<DialogueTemplateConfig>();
  }

  /**
   * Await-able mechanism for delaying for a set period of time
   */
  private _sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
}
