// Sử dụng trực tiếp placeholder data thay vì database
import { formatCurrency } from './utils';
import { users, customers, invoices, revenue } from './placeholder-data';
import type {
  CustomerField,
  InvoicesTable,
  LatestInvoice,
  Revenue,
} from './definitions';

export async function fetchRevenue(): Promise<Revenue[]> {
  // Simulate loading delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return revenue;
}

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const latestInvoices = invoices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id);
      return {
        id: invoice.customer_id + '-' + invoice.date, // Tạo ID unique
        name: customer?.name || 'Unknown Customer',
        image_url: customer?.image_url || '/customers/default.png',
        email: customer?.email || 'unknown@email.com',
        amount: formatCurrency(invoice.amount),
      };
    });

  return latestInvoices;
}

export async function fetchCardData() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const numberOfInvoices = invoices.length;
  const numberOfCustomers = customers.length;

  const totalPaidInvoices = formatCurrency(
    invoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.amount, 0)
  );

  const totalPendingInvoices = formatCurrency(
    invoices
      .filter((invoice) => invoice.status === 'pending')
      .reduce((total, invoice) => total + invoice.amount, 0)
  );

  return {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  };
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Kết hợp invoices với customer data
  const invoicesWithCustomers: InvoicesTable[] = invoices.map((invoice, index) => {
    const customer = customers.find((c) => c.id === invoice.customer_id);
    return {
      id: `invoice-${index}`, // Tạo ID đơn giản
      customer_id: invoice.customer_id,
      name: customer?.name || 'Unknown Customer',
      email: customer?.email || 'unknown@email.com',
      image_url: customer?.image_url || '/customers/default.png',
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status as 'pending' | 'paid',
    };
  });

  // Filter dựa trên query
  let filteredInvoices = invoicesWithCustomers;
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredInvoices = invoicesWithCustomers.filter(
      (invoice) =>
        invoice.name.toLowerCase().includes(searchTerm) ||
        invoice.email.toLowerCase().includes(searchTerm) ||
        invoice.amount.toString().includes(searchTerm) ||
        invoice.date.includes(searchTerm) ||
        invoice.status.toLowerCase().includes(searchTerm)
    );
  }

  // Sort theo date (mới nhất trước) và paginate
  const sortedInvoices = filteredInvoices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(offset, offset + ITEMS_PER_PAGE);

  return sortedInvoices;
}

export async function fetchInvoicesPages(query: string): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Tương tự logic filter như trên
  const invoicesWithCustomers = invoices.map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id);
    return {
      name: customer?.name || 'Unknown Customer',
      email: customer?.email || 'unknown@email.com',
      amount: invoice.amount,
      date: invoice.date,
      status: invoice.status,
    };
  });

  let filteredInvoices = invoicesWithCustomers;
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredInvoices = invoicesWithCustomers.filter(
      (invoice) =>
        invoice.name.toLowerCase().includes(searchTerm) ||
        invoice.email.toLowerCase().includes(searchTerm) ||
        invoice.amount.toString().includes(searchTerm) ||
        invoice.date.includes(searchTerm) ||
        invoice.status.toLowerCase().includes(searchTerm)
    );
  }

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  return totalPages;
}

export async function fetchCustomers(): Promise<CustomerField[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
  }));
}

export async function fetchInvoiceById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Tìm invoice đầu tiên làm example (vì đây là demo)
  const invoice = invoices[0];
  
  return {
    id: id,
    customer_id: invoice.customer_id,
    amount: invoice.amount / 100, // Convert cents to dollars
    status: invoice.status as 'pending' | 'paid',
  };
}

export async function fetchFilteredCustomers(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Tính toán statistics cho mỗi customer
  const customersWithStats = customers.map((customer) => {
    const customerInvoices = invoices.filter(
      (invoice) => invoice.customer_id === customer.id
    );

    const total_invoices = customerInvoices.length;
    const total_pending = customerInvoices
      .filter((invoice) => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const total_paid = customerInvoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image_url: customer.image_url,
      total_invoices,
      total_pending: formatCurrency(total_pending),
      total_paid: formatCurrency(total_paid),
    };
  });

  // Filter theo query nếu có
  let filteredCustomers = customersWithStats;
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredCustomers = customersWithStats.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
    );
  }

  return filteredCustomers;
}