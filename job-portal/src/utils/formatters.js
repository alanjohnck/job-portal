export const formatSalary = (min, max, currency, period = 'Yearly') => {
    if (!min && !max) return 'Negotiable';
    const curr = currency === 'USD' ? '$' : currency;
    const suffix = period === 'Yearly' ? 'k' : '';
    const divisor = period === 'Yearly' ? 1000 : 1;

    if (min && max) return `${curr}${min / divisor}${suffix} - ${curr}${max / divisor}${suffix}`;
    if (min) return `${curr}${min / divisor}${suffix}+`;
    return `Up to ${curr}${max / divisor}${suffix}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
