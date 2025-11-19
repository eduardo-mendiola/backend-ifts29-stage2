import PermissionAwareController from './PermissionAwareController.js';
import ExpenseCategory from '../models/ExpenseCategoryModel.js';

class ExpenseCategoryController extends PermissionAwareController {
    constructor() {
        super(ExpenseCategory, 'expense-categories', 'expense_categories', 'EXC-');
    }
}

export default new ExpenseCategoryController();
