import BaseController from './BaseController.js';
import ExpenseCategory from '../models/ExpenseCategoryModel.js';

class ExpenseCategoryController extends BaseController {
    constructor() {
        super(ExpenseCategory, 'expense-categories', 'CEX-');
    }
}

export default new ExpenseCategoryController();
