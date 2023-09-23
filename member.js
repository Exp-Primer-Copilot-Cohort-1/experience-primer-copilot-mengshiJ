function skillsMember()
{
    var skills = ["HTML", "CSS", "JS", "PHP", "MySQL"];
    var member = {
        name: "John",
        age: 25,
        skills: skills,
        address: {
            street: "5th Avenue",
            number: 123,
            city: "New York"
        }
    };
    console.log(member.skills[2]);
    console.log(member.address.city);
}


