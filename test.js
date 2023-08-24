const updatedUserData = {};
      if (name) updatedUserData.name = name;
      if (email) updatedUserData.email = email;
      if (photo) updatedUserData.photo = photo;
      if (phone) updatedUserData.phone = phone;
      if (password) {
        const passwordHash = bcrypt.hashSync(password);
        updatedUserData.password = passwordHash;
      }

      const { data: updatedData, error: updateError } = await supabase
        .from('users')
        .update(updatedUserData)
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }