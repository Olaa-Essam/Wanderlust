import APIManager from "../managers/APIManager.js";
import StorageManager from "../managers/storageManager.js";
import LoadingManager from "../utils/loading.js";
import ToastManager from "../utils/toast.js";
import Modal from "../utils/modal.js";

export default class CurrencyView {
  private apiManager: APIManager;
  private storageManager: StorageManager;

  constructor(apiManager: APIManager, storageManager: StorageManager) {
    this.apiManager = apiManager;
    this.storageManager = storageManager;
  }

}