import { Page } from '@playwright/test';
import {
  HeaderComponent,
  HeroBannerComponent,
  LanguageSelectionModal,
  SearchboxComponent,
} from '../components/index.js';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly languageSelectionModal: LanguageSelectionModal;
  readonly searchbox: SearchboxComponent;
  readonly heroBanner: HeroBannerComponent;

  constructor(page: Page) {
    super(page, '/');
    this.header = new HeaderComponent(page);
    this.languageSelectionModal = new LanguageSelectionModal(page);
    this.searchbox = new SearchboxComponent(page);
    this.heroBanner = new HeroBannerComponent(page);
  }

  //temporary method
  async dismissSignInInfo() {
    await this.page.getByRole('button', { name: 'Dismiss sign-in info.' }).click();
  }
}
