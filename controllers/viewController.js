exports.getTour = (req, res) => {
  res.status(200).render('overview', { title: 'The Forest Hiker Tour' });
};

exports.getOverview = (req, res) => {
  res.status(200).render('overview', { title: 'All Tours' });
};
